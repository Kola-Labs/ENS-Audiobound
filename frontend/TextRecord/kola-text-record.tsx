import React from 'react';
import { PageComponent } from '../../../common/component/page-component';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'business/redux/reducer';
import KolaWalletConnection from 'base/network/web3/wallet-connection';
import musicContract from 'base/network/web3/contract';
import { RoundText } from '../../component/Steps/RoundText';
import { StyleButton } from '../../component/Steps/Button';
import { R } from 'business/resource/resource';
import { KolaRoute } from '../../route/kola-route';
import { NavLink } from 'react-router-dom';
import ENSDomain from 'business/component/TextRecordWizard/ensDomain';
import Toast from 'common/component/toast';
import graphApi from 'base/network/graph/graph-api';
import musicGraph from 'business/api/graph';
import { StyleTag } from 'business/component/BottomTag';
import Loading from 'common/component/Spinner';
import 'animate.css';
import generalService from "../../api/general-service";

const KolaTextRecordPageRoot = styled(Box)`
	width: 100%;
	background: #fff;
	padding: 74px 95px 20px;
	overflow: hidden;
	position: relative;
	height: calc(100vh - 25px);
	.header {
		margin-bottom: 70px;
		.nav {
			color: #FFF;
			text-stroke: 1px;
			-webkit-text-stroke: 1px #000;

			font-family: 'Syncopate';
			font-style: normal;
			font-weight: 700;
			font-size: 40px;
			line-height: 42px;
			text-align: center;
		}
	}
	.content {
		display: flex;
		height: 100%;
		.left {
			margin-right: 56px;
			overflow-y: scroll;
			.first {
				.message-input {
					margin-bottom: 31px;
					width: 617px;
					height: 69px;
					background: #ffffff;
					border: 1.8178px solid #000000;
		
					font-family: "Orbitron";
					font-style: normal;
					font-weight: 700;
					font-size: 18px;
					line-height: 69px;
					color: #333333;
					padding-left: 24px;
				}
			}
			.title {
				font-family: 'Epilogue';
				font-style: normal;
				font-weight: 500;
				font-size: 16px;
				line-height: 16px;
				color: #000000;
				margin-bottom: 33px;
			}
			.dropdown-wrapper {
				position: relative;
				display: flex;
				flex-direction: column;
				cursor: pointer;
				.dropdown {
					width: 617px;
					height: 68px;
					left: 312px;
					top: 183px;
					border: 1.8178px solid #000000;

					background: #ffffff;
					z-index: 1;
					.dropdown-item {

						font-family: 'Orbitron';
						font-style: normal;
						font-weight: 400;
						font-size: 20px;
						letter-spacing: 0.328437px;
						text-align: center;
						color: #000000;
						line-height: 68px;
						text-align: center;
						overflow: hidden;
						word-break: break-all;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					&.sub {
						border-top: none;
					}
					.dropdownSelect {
						content: '';
						width: 617px;
						height: 68px;
						border: 1.8178px solid #000000;
						border-top: none;
						position: absolute;
						opacity: 0.5;
						top: 15px;
						left: 0px;
					}
					.dropdownSelect1 {
						opacity: 0.4;
						top: 25px;
					}
					.dropdownSelect2 {
						opacity: 0.3;
						top: 35px;
					}
					.dropdownSelect3 {
						opacity: 0.2;
						top: 45px;
					}
					.dropdownSelect4 {
						opacity: 0.1;
						top: 55px;
					}
					.dropdownSelect5 {
						opacity: 0.1;
						top: 65px;
					}
				}
			}
			.second {
				.cover {
					position: absolute;
					height: 100%;
					width: 100%;
					opacity: 0;
					z-index: 10;
				}
				audio {
					width: 100%;
					margin-bottom: 20px;
				}
				&.inactive {
					margin-top: 100px;
					opacity: 0.3;
				}
				&.active {
					position: static;
					margin-top: 125px;
					margin-bottom: 125px;
					opacity: 1;
				}
				.content-wrapper {
					display: flex;
					.domain-wrapper {
						margin-right: 23px;
						width: 137px;
						height: 68px;
						font-family: 'Orbitron';
						font-style: normal;
						font-weight: 400;
						font-size: 20px;
						line-height: 68px;
						text-align: center;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;

						color: #000000;
						background: #ffffff;
						border: 1.8178px solid #000000;
					}
					.dropdown-wrapper {
						.dropdown {
							width: 461px;
						}
					}
				}
				.button-wrapper {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 100px;
				}
			}
			.confirm {
				margin-top: 120px;
			}
		}
		.right {
			.title {
				font-family: 'Epilogue';
				font-style: normal;
				font-weight: 500;
				font-size: 16px;
				line-height: 16px;
				color: #000000;
				margin-bottom: 33px;
			}
			.register-wrapper {
				display: flex;
				align-items: center;
				.input {
					width: 224px;
					height: 68px;
					background: #ffffff;
					border: 1.8178px solid #000000;
					margin-right: 10px;
					padding: 22px 25px;

					font-family: 'Maven Pro';
					font-style: normal;
					font-weight: 500;
					font-size: 16px;
					line-height: 19px;

					color: #000000;
					&:active {
						outline: none;
					}
					&:focus {
						outline: none;
					}
				}
				.btn {
					background: #000000;
					border: 1.8178px solid #000000;
					font-family: 'Maven Pro';
					font-style: normal;
					font-weight: 700;
					font-size: 20px;
					line-height: 48px;
					text-align: center;
					letter-spacing: 0.333544px;

					color: #ffffff;
					padding: 8px 20px;

					text-shadow: 0px 2.66835px 5.33671px rgba(38, 50, 56, 0.16),
						0px 5.33671px 10.6734px rgba(38, 50, 56, 0.08);
				}
			}
			.tip-wrapper {    
				position: absolute;
				bottom: 30px;
				font-family: 'Epilogue';
				font-size: 15px;
				line-height: 20px;
				margin-right: 45px;
				color: #000000;
				.tip-title {
					font-style: normal;
					font-weight: 700;
					margin-bottom: 22px;
				}
				.tip-content {
					font-family: 'Epilogue';
					font-style: normal;
					font-weight: 400;
					font-size: 11px;
					line-height: 20px;
					color: #000000;

				}
			}
		}
	}
`;

const domains = ['asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahasdasdlksajlkdj adjkas jdjka kdashkl jsahdkljahsk jaksjdhasl adskj haklsj dhaksj hdakjshklsdjahklsjadh laksjdhaklsjdhalajkadslskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', , 'asdashdjkahasdasdlksajlkdj adjkas jdjka kdashkl jsahdkljahsk jaksjdhasl adskj haklsj dhaksj hdakjshklsdjahklsjadh laksjdhaklsjdhalajkadslskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahasdasdlksajlkdj adjkas jdjka kdashkl jsahdkljahsk jaksjdhasl adskj haklsj dhaksj hdakjshklsdjahklsjadh laksjdhaklsjdhalajkadslskdjs.eth', 'asdashdjkahskdjs.eth', 'asdashdjkahskdjs.eth']
class KolaTextRecordPage extends PageComponent {
	state = {
		currentStep: 0,
		newEnsDomain: '',
		showDropdown: false,
		showNFTDropdown: false,
		showVoiceDropdown: false,
		selection: '',
		selectionNft: '',
		domains: [],
		musicNfts: [],
		speech: '',
		voices: '',
		ttsOutput: '',
	};
	handleNextStep() {
		this.setState((prevState, props) => {
			return {
				currentStep: prevState.currentStep + 1,
			};
		});
	}

	handlePrevStep = () => {
		this.setState((prevState, props) => {
			return {
				currentStep: prevState.currentStep - 1,
			};
		});
	};

	newEnsDomainChanged(ev: any) {
		this.setState({ newEnsDomain: ev.target.value });
	}

	async handleConfirm(type) {
		// { "uri": "https://kola-tts-training-audio.s3.amazonaws.com/model_output_tts_demo_ethsf/a4a823e0-ba6f-47eb-a9f8-6be0219e7bab.wav" }
		// if (!this.state.selection) {
		// 	Toast.show({ type: 'error', data: 'Please select a domain' });
		// 	return;
		// }
		if (type === 0) {
			if (!this.state.speech) {
					Toast.show({ type: 'error', data: 'Please input a message' });
					return;
			}
			if (!this.state.voices) {
					Toast.show({ type: 'error', data: 'Please select a voice' });
					return;
			}
			try {
				Loading.show();
				// const res = await generalService.submitTTSJob("testing sentence", "vitalik");
				const res = { "uri": "https://kola-tts-training-audio.s3.amazonaws.com/model_output_tts_demo_ethsf/a4a823e0-ba6f-47eb-a9f8-6be0219e7bab.wav" }
				this.setState({ 
					selectionNft: res.uri,
				})
				this.handleNextStep();
				Loading.hide();
			} catch (e) {
				Loading.hide();

			}
		} else if (type === 1) {
			if (!this.state.selection) {
					Toast.show({ type: 'error', data: 'Please select a domain' });
					return;
			}
			this.handleNextStep();
		}
	}

	handleClick(type?: number) {
		if (type === 1) {
			if (this.state.currentStep === 0) {
				return;
			}
			this.setState((prev) => ({
				showNFTDropdown: !prev.showNFTDropdown,
			}));
		} else if (type === 2) {
			this.setState((prev) => ({
				showVoiceDropdown: !prev.showVoiceDropdown,
			}));

		} else {
			this.setState((prev) => ({
				showDropdown: !prev.showDropdown,
			}));
		}
	}

	handleSelect(i: string, type?: number) {
		if (type) {
			this.setState({
				showNFTDropdown: false,
				selectionNft: i,
			});
		} else {
			this.setState({
				showDropdown: false,
				selection: i,
			});
		}
	}

	handleSelectVoice(index: number) {
		if (index === 0) {
			this.setState({
				showVoiceDropdown: false,
				voices: "vitalik",
			});
		} else if(index === 1){
			this.setState({
				showVoiceDropdown: false,
				voices: "suda",
			});
		}
	}

	async handleSubmit() {
		if (!this.state.selectionNft || !this.state.selection) {
			return;
		}
		try {
			Loading.show();
			// const metadata = await musicContract.getMetadataForEnsDomain(
			// 	'ens',
			// 	this.state.selectionNft
			// );
			// if (!metadata) {
			// 	throw new Error('No metadata for nft')
			// }
			await graphApi.setText(
				'ens',
				this.state.selection,
				'audio',
				this.state.selectionNft
			);
			Loading.hide();

			Toast.show({ data: 'Text record updated', type: 'info', duration: 15000 });
		} catch (err) {
			Loading.hide();
			Toast.show({ data: err.message, type: 'error' });
		}
	}

	// async submitTTSJob() {
	// 	try {
	// 		// const ttsOutput = await generalService.submitTTSJob(this.state.speech, this.state.voices);
	// 		const ttsOutput = await generalService.submitTTSJob("testing sentence", "vitalik");
	// 		console.log("ttsOutput: ", ttsOutput);
	// 		this.setState({ttsOutput: ttsOutput});
	// 	} catch (e) {
	// 		Toast.show({ type: 'error', data: e.error });
	// 	}
	// }

	async componentDidMount() {
		super.componentDidMount();
		if (!this.props.token) {
			await KolaWalletConnection.getInstance().connect();
		}
		try {
			const domains = await graphApi.getDomainsOfOwner(
				'ens',
				this.props.token
			);
			const userNfts = await musicGraph.getMusicNftsOfOwner(
				'ens',
				this.props.token
			);
			this.setState({ domains, musicNfts: userNfts });
		} catch (e) {
			Toast.show({ type: 'error', data: e });
		}
	}
	render() {
		return (
			<KolaTextRecordPageRoot>
				<div className='header'>
					<RoundText
						className='nav'
						step={this.state.currentStep ? 'audio' : 'audible'}
					/>
				</div>
				<div className='content'>
					<div className='left'>
						<div className='first'>
							<div className='title'>
								Type the message you want to hear
							</div>
							<input
								className='message-input'
								type='text'
								placeholder=''
								onChange={(message) => this.setState({speech: message})}
							/>
						</div>
						<div className='first'>
							<div className='title'>
								Choose a voice
							</div>
							<div className='dropdown-wrapper'>
								<div
									className='dropdown button'
									onClick={() => this.handleClick(2)}
								>
									{new Array(6).fill('').map((item, index) => <div key={index} className={`dropdownSelect dropdownSelect${index+1}`}></div>)}
									<Typography className="dropdown-item">
										{this.state.voices || 'Choose a voice'}
									</Typography>
								</div>
								{this.state.showVoiceDropdown
									? ["Vitalik", "Suda"].map((i, index) => (
										<div
											key={index}
											className={`dropdown button sub sub-${index}`}
											onClick={() =>
												this.handleSelectVoice(index)
											}
										>
											<Typography className="dropdown-item">{i}</Typography>
										</div>
									))
									: null}
							</div>
						</div>
						<div className='first'>
							{this.state.currentStep === 0 && !this.state.showVoiceDropdown ? (
								<StyleButton
									onClick={() => this.handleConfirm(0)}
									className='confirm'
									text='Say it!'
									type={this.state.voices && this.state.speech ? '' : 'grey'}
								/>
							) : null}
						</div>
						<div
							className={`second ${
								this.state.currentStep === 1
									? 'active'
									: 'inactive'
							}`}>
							<audio src={this.state.selectionNft} controls autoPlay={true}></audio>
							<div className='title'>
									Select an ENS domain from your wallet
								</div>
								<div className='dropdown-wrapper'>
									<div
										className='dropdown button'
										onClick={() => this.handleClick()}
									>
										{new Array(6).fill('').map((item, index) => <div key={index} className={`dropdownSelect dropdownSelect${index+1}`}></div>)}
										<Typography className="dropdown-item">
											{this.state.selection || 'Select your domain'}
										</Typography>
									</div>
									{this.state.showDropdown
										? this.state.domains.map((i, index) => (
											<div
												key={index}
												className={`dropdown button sub sub-${index}`}
												onClick={() =>
													this.handleSelect(i.domain)
												}
											>
												<Typography className="dropdown-item">{i.domain}</Typography>
											</div>
										))
										: null}
								</div>
								{this.state.currentStep === 1 && !this.state.showDropdown ? (
									<div className='button-wrapper'>
										<StyleButton
											className=''
											text='back'
											type="grey"
											onClick={() => this.handlePrevStep()}
										/>
										<StyleButton
											className=''
											text='confirm'
											type={this.state.selectionNft ? '' : 'grey'}
											onClick={() => this.handleConfirm(1)}
										/>
									</div>) : null }
						</div>
						<div
							className={`second ${
								this.state.currentStep === 2
									? 'active'
									: 'inactive'
							}`}
						>
							{this.state.currentStep === 0 ? (
								<div
									className='cover'
									onClick={() => {
										return;
									}}
								></div>
							) : null}
							<div className='title'>
								Set ENS text-record for your Audio Identity
							</div>
							<div className='content-wrapper'>
								<div className='domain-wrapper'>
									Audio
								</div>
								<div className='dropdown-wrapper'>
									<div
										className='dropdown button'
										onClick={() => this.handleClick(1)}
									>
										<Typography className="dropdown-item">{this.state.selectionNft ||
											'Select your NFT'}</Typography>
										
									</div>
								</div>
							</div>
							<div className='button-wrapper'>
								<StyleButton
									className=''
									text='back'
									type="grey"
									onClick={() => this.handlePrevStep()}
								/>
								<StyleButton
									className=''
									text='confirm'
									type={this.state.selectionNft ? '' : 'grey'}
									onClick={() => this.handleSubmit()}
								/>
							</div>
						</div>
					</div>
					<div className='right'>
						<div className='title'>Register a new ENS</div>
						<div className='register-wrapper'>
							<input
								className='input'
								type='text'
								placeholder=''
								onChange={(ev) => this.newEnsDomainChanged(ev)}
							/>
							<a
								href={
									'https://app.ens.domains/' +
									(this.state.newEnsDomain
										? 'search/' + this.state.newEnsDomain
										: '')
								}
								target='_blank'
								className='btn'
							>
								Register
							</a>
						</div>
						<div className="tip-wrapper">
							<div className="tip-title">Unleash creativity with AI, for a soundful web 3.0 🌟</div>
							<div className='tip-content'> ENS is the unique identity for most web3 users. By linking with the ENS domain, Audiobound creates another layer of users' digital identity and enables users to sound like anyone on the web3. So grab your ENS as seed NFT, plant it in the soil of AI and hear the magic voice.</div>
						</div>
					</div>
				</div>
				<StyleTag text='Musicbound' bgColor={'#EBCC4B'} />
			</KolaTextRecordPageRoot>
		);
	}
}
const mapStateToProps = (mapStateToProps: RootState) => ({
	token: mapStateToProps.userLoginReducer.token,
});

const connector = connect(mapStateToProps);
export default connector(KolaTextRecordPage);
