/* eslint-disable import/no-anonymous-default-export */
import backendApi from "base/network/http/backend-api"

const didHost = 'https://indexer-v1.did.id'

export default {
    getDidDomainsOfOwner: async (wallet) => {
        try {
            const res = await backendApi.post(
                '/v1/account/list',
                {
                    type: 'blockchain',
                    key_info: {
                        chain_id: '1',
                        key: wallet
                    }
                },
                didHost
            )
            return res.data.account_list.map(d => {return {domain: d.account}})
        } catch (err) {
            console.log(err);
        }    
    }
}