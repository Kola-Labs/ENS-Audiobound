/* eslint-disable no-throw-literal */
/* eslint-disable import/no-anonymous-default-export */
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import ENS from '@ensdomains/ensjs';
import KolaWalletConnection from "base/network/web3/wallet-connection";
import erc721ContractJSON from "../../../file/erc721-contract.json"
import axios from "axios";
import { sendEvent } from 'business/api/gtag';

const ENS_SUBGRAPH = process.env.REACT_APP_ENS_SUBGRAPH_MAINNET
const ENS_REGISTRY_CONTRACT = process.env.REACT_APP_ENS_REGISTRY_CONTRACT_MAINNET


const avatarTextRecordToUrl = async (avatarRecord) => {
  // Refer to https://gist.github.com/Arachnid/9db60bd75277969ee1689c8742b75182
  //
  try {
    if (avatarRecord === '') {
      return null
    }
    if (avatarRecord.startsWith('https://')) {
      return avatarRecord
    }
    if (avatarRecord.startsWith('ipfs://')) {
      return avatarRecord.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }
    if (avatarRecord.startsWith('data:')) {
      return avatarRecord
    }
    const keys = /erc721:(.*)\/(.*)/.exec(avatarRecord)
    const contractAddress = keys[1]
    const tokenId = keys[2]
    const web3 = KolaWalletConnection.getInstance().web3
    const obj = new web3.eth.Contract(erc721ContractJSON as any, contractAddress)
    const tokenUri = await obj.methods.tokenURI(tokenId).call()
    const metadata = (await axios.get(tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/'))).data
    const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
    sendEvent('ensapi-avatarTextRecordToUrl');
    return imageUrl
  }
  catch (err) {
    console.error(err)
    return null
  }
}

const musicTextRecordToUrl = async (musicRecord) => {
  if (musicRecord.startsWith('https://')) {
    return musicRecord
  }
  if (musicRecord.startsWith('ipfs://')) {
    return musicRecord.replace('ipfs://', process.env.REACT_APP_IPFS_GATEWAY + '/ipfs/')
  }
  return musicRecord // TODO extend to other format pending ENS
}

export default {
  getEnsDomainsOfOwner: async (wallet) => {
    try {
      const client = new ApolloClient({
        link: new HttpLink({uri: ENS_SUBGRAPH}),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            fetchPolicy: "no-cache"
          }
        }
      })
      let res = await client.query({
        query: gql`
          {
            accounts(where: {id: "${wallet}"}) {
              domains {
                id
                name
              }
            }
          }
        `
      });
      sendEvent('ensapi-getEnsDomainsOfOwner');
      return res.data.accounts[0] && res.data.accounts[0].domains.map(d => {return {domain: d.name}})
      // return [{domain: 'e.eth'}, {domain: '8rōnin.eth'}]
    }
    catch (e) {
      console.error(e)
      return []
    }
  },
  setText: async (address, key, value) => {
    const provider = KolaWalletConnection.getInstance().provider
    const ensAddress = ENS_REGISTRY_CONTRACT
    const ens = new ENS({ provider, ensAddress })
    const name = ens.name(address);
    sendEvent('ensapi-setText');
    await name.setText(key, value)
  },
  getAllTextRecords: async (address) => {
    let textRecords = {
      url: undefined,
      avatar: undefined,
      music: undefined,
      audio: undefined,
      discord: undefined,
      github: undefined,
      reddit: undefined,
      telegram: undefined,
      twitter: undefined,
      email: undefined,
    }
    try {
      const provider = KolaWalletConnection.getInstance().provider
      const ensAddress = ENS_REGISTRY_CONTRACT
      const ens = new ENS({ provider, ensAddress })
      const primaryEnsDomain = await ens.getName(address)
      if (primaryEnsDomain !== null && primaryEnsDomain.name !== '0x0000000000000000000000000000000000000000') {
        const name = ens.name(primaryEnsDomain.name)
        textRecords.url = primaryEnsDomain.name
        textRecords.avatar = await avatarTextRecordToUrl(await name.getText('avatar'))
        textRecords.music = await musicTextRecordToUrl(await name.getText('music'))
        textRecords.audio = await musicTextRecordToUrl(await name.getText('audio'))
        textRecords.discord = await name.getText('com.discord')
        textRecords.github = await name.getText('com.github')
        textRecords.reddit = await name.getText('com.reddit')
        textRecords.telegram = await name.getText('org.telegram')
        textRecords.twitter = await name.getText('com.twitter')
        textRecords.email = await name.getText('email')
      }
      sendEvent('ensapi-getAllTextRecords');
    }
    catch (e) {
      console.error(e)
    }
    return textRecords
  },
}