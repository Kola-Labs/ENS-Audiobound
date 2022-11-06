import React from 'react';
import { RootState } from '../../redux/reducer';
import { Dispatch } from 'redux';
import { Link } from 'react-router-dom'
import { Util } from "common/util";
import {
	loginIn,
	loginOut,
	UserLoginAction,
	UserLoginState,
} from '../../redux/actions/user-login-action';
import { connect } from 'react-redux';
import { KolaRoute } from '../../route/kola-route';
import { Typography, Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PageComponent } from '../../../common/component/page-component';
import Toast from 'common/component/toast';
import styled from 'styled-components';
import Loading from '../../../common/component/Spinner';
import KolaWalletConnection from 'base/network/web3/wallet-connection';
import { KolaClipBoard } from 'business/component/kola-clip-board';
import { KolaNavigator } from '../../../common/navigator/kola-navigator';
import { StyleButton } from 'business/component/Steps/Button';
import { StyleText } from 'business/component/StyleText';
import graphApi from 'base/network/graph/graph-api';
import musicGraph from "business/api/graph";
import musicContract from 'base/network/web3/contract';
import boxDefault from './images/box.svg';
import BoxYellow from './images/yellow-box.svg';
import BoxGreen from './images/green-box.svg';
import BoxBlue from './images/blue-box.svg';
import Points10000 from './images/points-10000.svg';
import CD from './images/CD.png';
import Time from './images/time.svg';
import Content from './images/content_1.svg';
import Earth from './images/earth.svg';
import twitter from './images/twitter.svg';
import discord from './images/discord.svg';
import medium from './images/medium.svg';
import Play from './images/play.svg';
import Pause from './images/pause.svg';
import BoxDetail from './images/item-detail.svg';
import { StyleTag } from 'business/component/BottomTag';
import { string } from 'prop-types';
import { sendEvent } from 'business/api/gtag';

const mapStateToProps = (mapStateToProps: RootState) => ({
	token: mapStateToProps.userLoginReducer.token,
	network: mapStateToProps.userLoginReducer.network
});

const mapDispatchToProps = (dispatch: Dispatch<UserLoginAction>) => ({
	loginIn: (token: string) => dispatch(loginIn(token)),
	loginOut: () => dispatch(loginOut()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const KolaMinePageStyle = styled(Box)`
	display: flex;
	background: #fff;
	width: 100%;
    height: calc(100vh - 25px);
	overflow: hidden;
    @media screen and (max-width: 960px) {
        width: 100vw;
        height: calc(100vh - 10vw);
        margin-left: 0px;
    }
	.user-page {
		flex-basis: 40%;
		padding-top: 105px;
		padding-left: 116px;
		margin-right: 130px;
		.user-wrapper {
			position: relative;
			width: 243px;
			height: 243px;
			.disk {
				width: 192px;
				position: absolute;
				z-index:0;
				right: 0;
				top: 50%;
				transform: translate(50%, -50%);
				transform-origin: 100% 0%;
				&.playing {
					animation: rotatingDisk 2s linear infinite;
				}
				@keyframes rotatingDisk {
					0% {
						transform: rotate(0deg) translate(50%, -50%);
					}
					100% {
						transform: rotate(360deg) translate(50%, -50%);
					}
				}
			}
			.player-wrapper {
				width: 243px;
				height: 243px;
				z-index: 1;
				position: absolute;
				border-radius: 15px;
				left: 0;
				top: 0;
				&:hover {
					cursor: pointer;
				}
			}
			.username-wrapper {
				padding-top: 285px;
				font-family: 'Syncopate';
				font-style: normal;
				font-weight: 700;
				font-size: 20px;
				line-height: 42px;
				letter-spacing: 0.25px;
				color: #000000;
				word-break: break-all;
			}
		}
	}
	.content-page {
		padding-top: 50px;
		flex-basis: 50%;
		height: 100%;
		position: relative;
		color: #000;
		padding-left: 0px;
		.title {
			font-family: 'Epilogue';
			font-style: normal;
			font-weight: 700;
			font-size: 20px;
			line-height: 20px;
			letter-spacing: 0.25px;
			margin-top: 105px;

			color: #000000;
			margin-bottom: 56px;
			.point {
				display: inline-block;
			}
		}
		.tip {
			font-family: 'Epilogue';
			font-style: normal;
			font-weight: 400;
			font-size: 12.6205px;
			line-height: 13px;
			display: flex;
			align-items: center;
			letter-spacing: 0.114013px;

			color: #000000;
		}
		.box-wrapper {
			display: flex;
			flex-wrap: wrap;
			margin-top: 18px;
			width: 400px;
			.box {
				width: 55px;
				height: 54px;
				margin-right: 2px;
				margin-bottom: 5px;
			}
		}
		.content-image {
			width: 80%:
		}
		.buttonWrapper {
			width: 100%;
			margin-top: 20px;
			.btn {
				display: inline-block;
				&:first-of-type {
					margin-right: 45px;
				}
			}
		}
	}
	.next {
		line-height: 100%;
		position: relative;
		width: 100px;
		width: 70px;
		.icon {
			color: black;
			position: absolute;
			top: 30%;
			padding: 0 5px;
			font-size: 40px;
			&:hover {
				cursor: pointer;
			}
		}
	}
	.points-page {
		background: #fff;
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		overflow-y: hidden;
		overflow-x: scroll;
		.next {
			line-height: 100%;
			position: relative;
			width: 100px;
			width: 70px;
			.icon {
				color: black;
				position: absolute;
				top: 30%;
				padding: 0 5px;
				font-size: 40px;
				&:hover {
					cursor: pointer;
				}
			}
		}
		.points-title {
			width: 99px;
			border-right: 1px solid #000000;
		}
		.box-wrapper {
			display: flex;
			padding-left: 100px;
			overflow: auto;
			.empty-wrapper {  
				padding-right: 100px;
				color: black;
				margin: 20% auto;
				font-family: 'Syncopate';
				font-style: normal;
				font-weight: 700;
				font-size: 30px;
				line-height: 1.5;
				letter-spacing: 1px;
				color: #000000;
				text-align: center;
			}
			.box-column {
				display: flex;
				.left{
					padding: 104px 0;
					display: flex;
					flex-wrap: nowrap;
					justify-content: flex-start;
					flex-direction: column;
					.box {
						flex-basis: 30%;
						width: 88px;
						margin-right: 95px;
						&:hover {
							cursor: pointer;
						}
						.box-name {
							margin-top: 17px;
							font-family: 'Syncopate';
							font-style: normal;
							font-weight: 700;
							font-size: 15px;
							line-height: 16px;
							letter-spacing: 0.25px;
							color: #000000;
							overflow: hidden;
							word-break: break-all;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
							box-orient: vertical;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							display: -webkit-box;
							display: box;
						}
					}
				}
				.right {
					padding-top: 84px;
					margin-right: 95px;
					display: flex;
					align-items: center;
					flex-direction: column;
					.item-detail {
						width: 234px;
						height: 299px;
						background: #FFFFFF;
						border: 1px solid #000000;
						padding: 42px 18px 0 42px;
						position: relative;
						transform-style: preserve-3d;
						&:before {
							content: '';
							width: 234px;
							height: 299px;
							position: absolute;
							transform: translateZ(-1px);
							background-color: ${props => props.selected?.color};
							left: -17px;
							top: -16px;
						}
						.video-wrapper {
							// width: 199px;
							height: 177px;
							background: #ECD04A;
							border: 1px solid #000000;
							position: relative;
							.box-detail {
								position: absolute;
								width: 100%;
								height: 100%;
								top: 50%;
								left: 0;
								transform: translateY(-50%);
								object-fit: fill;
								margin: auto;
							}
						}
						.item-detail-name {
							margin-top: 17px;
							font-family: 'Syncopate';
							align-items: center;
							text-stroke: 1px ;
							-webkit-text-stroke: 1px #000;
							font-style: normal;
							font-weight: 400;
							font-size: 16px;
							line-height: 1.1;
							letter-spacing: 0.25px;
							overflow: hidden;
							word-break: break-all;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
							box-orient: vertical;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							display: -webkit-box;
							display: box;
						}
					}
					.box-detail-text {
						width: 234px;
						margin-top: 20px;
						margin-left: 10px;
						.list-item {
							font-family: 'VT323';
							font-style: normal;
							font-weight: 400;
							font-size: 20px;
							line-height: 27px;
							letter-spacing: 0.123775px;
							color: #000000;
							display: flex;
							justify-content: flex-start;
							.key {
								display: inline-block;
								width: 101px;
								flex-shrink: 0;
							}
							.value {
								display: inline-block;
								word-break: break-word;
							}
						}
					}
					.box-button-wrapper {
						display: flex;
    					transform: scale(0.7);
					}
				}
			}
		}
	}
`;

interface INft {
	input: string,
	[propName: string]:any;
}

class KolaMinePage extends PageComponent {
	state = {
		playing: false,
		currentAudio: undefined,
		firstPage: true,
		musicNft: [] as INft[],
		groupNft: [],
		selectedNft: {} as INft,
		textRecords: {
			url: undefined,
			avatar: undefined,
			audio: undefined,
			music: undefined,
			discord: undefined,
			github: undefined,
			reddit: undefined,
			telegram: undefined,
			twitter: undefined,
			email: undefined,
		},
	};


	getBox(item: INft) {
		switch(item.color) {
			case '#ECD04A':
				return BoxYellow;
			case '#1848DA':
				return BoxBlue;
			case '#67BC89':
				return BoxGreen;
		}
	}

	async handleSelect(item: INft) {
		if (this.state.selectedNft && this.state.selectedNft.input === item.input) {
			this.setState({selectedNft: {}});
		} else {
			sendEvent('profile-select_music_nft')
			this.setState({selectedNft: item});
		}
	}

	handleShare(item) {
		window.open(`https://twitter.com/intent/tweet?text=My%20ENS%20${item}%20has%20its%20AI-generated%20audible%20identity!%20Check%20my%20E2M%20identity%20and%20%40Kolametaverse%20out!%20%23ENS2Music%20%23KolaMaxis`)
	}

	handlePlay() {
		if (!this.state.textRecords.audio) {
			Toast.show({
				data: 'You do not have an audio record',
				type: 'error',
			});
			return;
		}
		if (!this.state.playing) {
			if (this.state.currentAudio === undefined) {
				this.state.currentAudio = new Audio(
					this.state.textRecords.audio
				);
			}
			this.state.currentAudio.play();
			this.state.currentAudio.addEventListener('ended', () => {
				this.setState({ playing: false });
			});
      		sendEvent('profile-play_music');
		} else {
			this.state.currentAudio.pause();
		}
		this.setState({ playing: !this.state.playing });
	}
	render() {
		const { token } = this.props;
		const encryptedToken =
			token && Util.simpleToken(token);
		return (
			<KolaMinePageStyle selected={this.state.selectedNft}>
				{
					<>
						<div className='user-page'>
							<div className="user-wrapper">
								<img src={CD} alt="" className={`disk ${this.state.playing ? 'playing' : null}`} />
								<img onClick={() => this.handlePlay()} src={this.state.playing ? Pause : Play} className='player-wrapper' />
								<div className='username-wrapper'>
									{this.state.textRecords.url || ''}
								</div>
								<div className='token-wrapper'>
									<span>{encryptedToken}</span>
									<KolaClipBoard
										className='clipboard'
										text={encryptedToken}
										fullText={token}
									></KolaClipBoard>
								</div>
							</div>
						</div>
						<div className='content-page'>
							<img src={Content} alt="" className='content-image' />
							{/* <div className='title'>
								<StyleText text={10000 * this.state.musicNft.length|| 0}></StyleText>
								<div className="point">Points</div>
								
							</div>
							<div className='tip'>
								5000 points to the next level!
							</div>
							<div className='box-wrapper'>
								{new Array(14).fill('').map((item, index) => (
									<div key={index}>
										<img
											src={boxDefault}
											alt=''
											className='box'
										/>
									</div>
								))}
							</div> */}
							<div className='buttonWrapper'>
								<StyleButton
									className="btn"
									type={this.state.musicNft.length ? '' : 'grey'}
									text='Audio identity'
									onClick={() => this.setTextRecord()}
								/>
								<StyleButton
									className="btn"
									text='Logout'
									onClick={() => this.logout()}
								/>
							</div>
						</div>
					</>
				}
				<StyleTag text="Audiobound" bgColor={'#ecd04a'} />
			</KolaMinePageStyle>
		);
	}

	redirectToOpensea(nft) {
		const subdomain =
			process.env.REACT_APP_NETWORK_MODE === "mainnet"
				? "www"
				: "testnets";
		window.open(
			"https://" +
				subdomain +
				".opensea.io/assets/" +
				musicContract.CONTRACT_ADDRESS('ens') +
				"/" +
				nft.id,
			"_blank"
		);

		sendEvent('profile-goto_opensea');
	}

	shiftPage() {
		this.setState((state) => {
			return {
				firstPage: !state.firstPage,
			};
		});
	}

	logout() {
		localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
		this.props.loginOut();
		KolaNavigator.jump(KolaRoute.ROOT_PAGE);
	}

	setTextRecord() {
		if (this.state.musicNft.length) {
			KolaNavigator.jump(KolaRoute.TEXTRECORD_PAGE);
		}
	}

	async componentDidMount() {
		super.componentDidMount();
		try {
			Loading.show()
			const { token } = this.props;
			if (!token) {
				await KolaWalletConnection.getInstance().connect();
			}
			// const textRecords = await graphApi.getAllTextRecords(this.props.token) || [];
			// this.setState({ textRecords });
			const textRecords = await graphApi.getAllTextRecords('ens', this.props.token) || [];
			// console.log(textRecords)
			// const ret = await musicGraph.getMusicNftsOfOwner('ens', this.props.token) || [];
			// ret.forEach(async textRecords => {
			// 	const metadata = await musicContract.getMetadataObjectFromIPFS('ens', textRecords.metadataUri)
			// 	textRecords.metadata = metadata
			// })
			// const groupNft = this.processNft(ret);
			this.setState({ textRecords});
			Loading.hide();
		} catch (e) {
            Toast.show({ type: 'error', data: e.message || 'Error! Please try again.' });
			Loading.hide();
		}
	}

	processNft(ret) {
		const group = []
		ret.forEach((item, index) => {
			if (index % 3 === 0) {
				item.color = '#ECD04A'
				group.push([item]);
			} else if (index % 3 === 1) {
				item.color = '#1848DA'
				group[group.length - 1].push(item)
			} else {
				item.color = '#67BC89'
				group[group.length - 1].push(item)
			}
		})
		return group
	}
}

export default connector(KolaMinePage);
