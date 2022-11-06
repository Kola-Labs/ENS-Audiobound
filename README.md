# Audiobound NFT with ENS

In this repository, we try to synthesize the voice of Vitalik and Suda using [PortaSpeech](https://github.com/NATSpeech/NATSpeech). 


## Install Dependencies

1. Install Pytorch from [https://pytorch.org](https://pytorch.org))
2. Install the following packages

```bash
## We tested on Linux/Ubuntu 18.04. 
## Install Python 3.6+ first (Anaconda recommended).

export PYTHONPATH=.
pip install -r requirements.txt
sudo apt install -y sox libsox-fmt-mp3
pip install flask
```


## Run frontend server

```bash
yarn start
```


## Download the pretrained models

a) Download pre-trained Vitalik TTS model from [https://drive.google.com/drive/folders/1YtBa4f0RDisCxvmbsTe4pMZ6qYr1wJlp?usp=sharing](https://drive.google.com/drive/folders/1YtBa4f0RDisCxvmbsTe4pMZ6qYr1wJlp?usp=sharing), and put them in ./checkpoints/ps_adv_vitalik_suda/  (This model is fully trained on [Vitalik dataset + Suda dataset + 100 other speakers].)

b) Download pre-trained hifi-gan model from [https://drive.google.com/drive/folders/1YuOoV3lO2-Hhn1F2HJ2aQ4S0LC1JdKLd](https://drive.google.com/drive/folders/1YuOoV3lO2-Hhn1F2HJ2aQ4S0LC1JdKLd), and put them in ./pretrained/hifigan_hifitts

## Run backend server

```python
python server.py
```

## Acknowledgments

Our codes are influenced by the following repos:

- [PyTorch Lightning](https://github.com/PyTorchLightning/pytorch-lightning)
- [ParallelWaveGAN](https://github.com/kan-bayashi/ParallelWaveGAN)
- [Hifi-GAN](https://github.com/jik876/hifi-gan)
- [espnet](https://github.com/espnet/espnet)
- [Glow-TTS](https://github.com/jaywalnut310/glow-tts)
- [DiffSpeech](https://github.com/MoonInTheRiver/DiffSinger)
