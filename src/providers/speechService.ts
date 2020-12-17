import { Injectable } from '@angular/core';
import { HttpClientServiceProvider } from './httpClientService';
import { Utils } from './utils';
import { HintTools } from './HintTools';
import { API_URL } from './apiUrl';
import { UNABLE_LOAD_USER_MEDIA } from './global';

@Injectable()
export class AudioService {
  private readonly maxRecordTime = 60000;

  private recorder;
  private audioData: AudioOption;
  private audioInput: MediaStreamAudioSourceNode;
  private context;
  private config;
  private callback;
  private isDisabled: boolean = false;

  private touchTimer = null;
  private recorderToast = null;
  private state: StateEnum;

  constructor(private httpC: HttpClientServiceProvider, private hintTools: HintTools) {}

  //region  数据准备

  private initAudioRecorder(stream, config?) {
    this.config = config || {};
    this.config.sampleBits = config?.sampleBits || 16; //采样数位 8, 16
    this.config.sampleRate = config?.sampleRate || 8000; //采样率(1/6 44100)
    this.context = new AudioContext();
    this.audioInput = this.context.createMediaStreamSource(stream);
    this.recorder = this.context.createScriptProcessor(4096, 1, 1);

    this.initAudioData(this.context, this.config);

    let _this = this;
    this.recorder.onaudioprocess = function (e) {
      _this.audioData.input(e.inputBuffer.getChannelData(0));
    };
  }

  private initAudioData(context, config) {
    this.audioData = {
      size: 0,
      buffer: [],
      inputSampleRate: context.sampleRate,
      inputSampleBits: 16,
      outputSampleRate: config?.sampleRate || 16,
      outputSampleBits: config?.sampleBits || 8000
    };

    this.audioData.input = (data) => {
      this.audioData.buffer.push(new Float32Array(data));
      this.audioData.size += data.length;
    };
    this.audioData.compress = () => {
      //合并
      let data = new Float32Array(this.audioData.size);
      let offset = 0;
      for (let i = 0; i < this.audioData.buffer.length; i++) {
        data.set(this.audioData.buffer[i], offset);
        offset += this.audioData.buffer[i].length;
      }
      //压缩
      let compression = Math.floor(this.audioData.inputSampleRate / this.audioData.outputSampleRate);
      let length = data.length / compression;
      let result = new Float32Array(length);
      let index = 0,
        j = 0;
      while (index < length) {
        result[index] = data[j];
        j += compression;
        index++;
      }
      return result;
    };
    this.audioData.encodeWAV = () => {
      let sampleRate = Math.min(this.audioData.inputSampleRate, this.audioData.outputSampleRate);
      let sampleBits = Math.min(this.audioData.inputSampleBits, this.audioData.outputSampleBits);
      let bytes = this.audioData.compress();
      let dataLength = bytes.length * (sampleBits / 8);
      let buffer = new ArrayBuffer(44 + dataLength);
      let data = new DataView(buffer);

      let channelCount = 1; //单声道
      let offset = 0;

      let writeString = function (str) {
        for (let i = 0; i < str.length; i++) {
          data.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      // 资源交换文件标识符
      writeString('RIFF');
      offset += 4;
      // 下个地址开始到文件尾总字节数,即文件大小-8
      data.setUint32(offset, 36 + dataLength, true);
      offset += 4;
      // WAV文件标志
      writeString('WAVE');
      offset += 4;
      // 波形格式标志
      writeString('fmt ');
      offset += 4;
      // 过滤字节,一般为 0x10 = 16
      data.setUint32(offset, 16, true);
      offset += 4;
      // 格式类别 (PCM形式采样数据)
      data.setUint16(offset, 1, true);
      offset += 2;
      // 通道数
      data.setUint16(offset, channelCount, true);
      offset += 2;
      // 采样率,每秒样本数,表示每个通道的播放速度
      data.setUint32(offset, sampleRate, true);
      offset += 4;
      // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
      offset += 4;
      // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
      data.setUint16(offset, channelCount * (sampleBits / 8), true);
      offset += 2;
      // 每样本数据位数
      data.setUint16(offset, sampleBits, true);
      offset += 2;
      // 数据标识符
      writeString('data');
      offset += 4;
      // 采样数据总数,即数据总大小-44
      data.setUint32(offset, dataLength, true);
      offset += 4;
      // 写入采样数据
      if (sampleBits === 8) {
        for (let i = 0; i < bytes.length; i++, offset++) {
          let s = Math.max(-1, Math.min(1, bytes[i]));
          let val = s < 0 ? s * 0x8000 : s * 0x7fff;
          val = Math.floor(255 / (65535 / (val + 32768)));
          data.setInt8(offset, val);
        }
      } else {
        for (let i = 0; i < bytes.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, bytes[i]));
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
      }
      return new Blob([data], { type: 'audio/wav' });
    };
  }

  public newAudioRecorder(callback, config?) {
    let _this = this;
    // this.getTencentAuthorization();
    if (callback) {
      let alertText = '';
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { audio: true }, //只启用音频
          function (stream) {
            _this.initAudioRecorder(stream);
            callback(_this.recorder);
          },
          function (error: any) {
            _this.isDisabled = true;
            switch (error.code || error.name) {
              case 'PERMISSION_DENIED':
              case 'PermissionDeniedError':
                alertText = '用户拒绝提供信息。';
                break;
              case 'NOT_SUPPORTED_ERROR':
              case 'NotSupportedError':
                alertText = '浏览器不支持硬件设备。';
                break;
              case 'MANDATORY_UNSATISFIED_ERROR':
              case 'MandatoryUnsatisfiedError':
                alertText = '无法发现指定的硬件设备。';
                break;
              default:
                alertText = '无法打开麦克风。异常信息:' + (error.code || error.name);
                break;
            }
            window.alert(alertText);
            this.throwError(alertText);
          }
        );
      } else {
        _this.isDisabled = true;
        alertText = '当前浏览器不支持录音功能。';
        window.alert(alertText);
        AudioService.throwError(alertText);
        return;
      }
    }
  }

  canRecording(): boolean {
    return navigator.getUserMedia != null;
  }

  // private getTencentASRUrl(){
  //   //https://console.cloud.tencent.com/api/explorer?Product=asr&Version=2019-06-14&Action=SentenceRecognition
  //   let url='asr.tencentcloudapi.com?';
  //   let extraHeaders:[
  //     {name:'X-TC-Action',value:'SentenceRecognition'},
  //     {name:'X-TC-Region',value:'APIExplorer'},
  //     {name:'X-TC-Timestamp',value:'1604026431'},
  //     {name:'X-TC-Version',value:'2019-06-14'},
  //     {name:'Authorization',value:'TC3-HMAC-SHA256'}
  //     // {name:'X-TC-Token',value:''}
  //     ];
  //   let params={
  //     Action:'SentenceRecognition',
  //     Version:'2019-06-14',
  //     ProjectId:0,
  //     SubServiceType:2,
  //     EngSerViceType:'16k_zh',
  //     SourceType:1,
  //     VoiceFormat:'wav',
  //     UsrAudioKey:this.getAudioKey(),
  //   };
  // }

  // private getTencentAuthorization(){
  //   let clientConfig={
  //     credential: {
  //       secretId: "AKIDmX2SdXReiXCnXcDAb8PPaXNk5AKMnxrq",
  //       secretKey: "sToAH7i397sTmpc9oAm8HAoCtQ0KPE9z",
  //     },
  //     region: "",
  //     profile: {
  //       httpProfile: {
  //         endpoint: "asr.tencentcloudapi.com",
  //       },
  //     },
  //   };
  //
  //   const client=new this.AsrClient(clientConfig);
  //
  //   const params={
  //     Action:'SentenceRecognition',
  //     Version:'2019-06-14',
  //     ProjectId:0,
  //     SubServiceType:2,
  //     EngSerViceType:'16k_zh',
  //     SourceType:1,
  //     VoiceFormat:'wav',
  //     UsrAudioKey:this.getAudioKey(),
  //   };
  //   client.SentenceRecognition(params).then(
  //     (data) => {
  //       console.log(data);
  //     },
  //     (err) => {
  //       console.error("error", err);
  //     }
  //   );
  // }
  //
  //endregion

  //region  交互

  async longPressRecordAudio(callback) {
    if (this.isDisabled) {
      await this.hintTools.presentToast(UNABLE_LOAD_USER_MEDIA);
      return;
    }
    Utils.debugLog('\n\nmouse down');
    this.callback = callback;
    this.changeState(StateEnum.WAITING);
    await this.clearToast(this.recorderToast);
    this.recorderToast = await this.hintTools.createToast('长按1秒后开始录音', 0);
    this.recorderToast.present();
    this.touchTimer = setTimeout(() => {
      //todo 切换toast或其文本时松手会无法捕获mouse up事件
      this.recorderToast.message = '正在录音';
      this.startRecordAudio();
      this.clearTimeoutTimer(this.touchTimer);
    }, 1000);
  }

  async stopTouchSpeechRecorder(argument) {
    this.clearTimeoutTimer(this.touchTimer);
    if (this.state == StateEnum.RECORDING) {
      Utils.debugLog('release', argument);
      let response = await this.stopRecordAudio();
      Utils.debugLog(response, 'stop touch recorder');
      this.callback(response);
    } else if (this.state == StateEnum.WAITING) {
      this.changeState(StateEnum.UNOCCUPIED);
      let timer = setTimeout(() => {
        this.clearToast(this.recorderToast);
      }, 1000);
      Utils.debugLog('click', argument);
      this.callback('');
    } else {
      Utils.debugLog('unhandled state', argument);
      // this.callback('');
    }
  }

  //endregion

  //region  处理

  private startRecordAudio() {
    try {
      //region  变更状态为recording
      this.changeState(StateEnum.RECORDING);
      Utils.debugLog('press');
      //endregion
      this.audioInput.connect(this.recorder);
      this.recorder.connect(this.context.destination);
      Utils.debugLog(this.recorder, 'recorder');
    } catch (error) {
      // TODO error
    }
  }

  private async stopRecordAudio() {
    //region
    this.clearToast(this.recorderToast);
    this.changeState(StateEnum.UNOCCUPIED);
    let loader = await this.hintTools.createLoader('转换中');
    loader.present();
    let response;
    //endregion
    try {
      this.recorder.disconnect();
      // console.log(this.getBlob(),'blob');
      response = await this.upload();
      loader.dismiss();
      Utils.debugLog(response, 'stop record audio');
      // this.getDownloadUrl();
      return response;
    } catch (e) {
      Utils.debugLog(e, 'stop record audio');
    } finally {
      loader.dismiss();
    }

    //region
    // let timer = setTimeout(()=>{
    //   loader.dismiss();
    //   clearTimeout(timer);
    // },2000);
    //endregion
  }

  /**
   * 获取音频文件
   * @returns {Promise<any>}
   */
  public getBlob() {
    // await this.stopRecordAudio();
    return this.audioData.encodeWAV();
  }

  public getDownloadUrl() {
    let url = window.URL.createObjectURL(this.getBlob());
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '录音文件');
    document.body.appendChild(link);
    link.click();
  }

  private async upload() {
    let url = API_URL + 'Audio/PostSentenceRecognition?';
    let uri = Utils.serializeObj({
      loginId: Utils.sGetLoginId()
    });
    try {
      let body = new FormData();
      body.append('audio_file.wav', this.getBlob());
      let response = await this.httpC.post(url + uri, body);
      Utils.debugLog(response, 'asr response');
      return response || '';
    } catch (e) {
      Utils.debugLog(e, 'failed to upload audio');
      AudioService.throwError(e);
    }
  }

  /**
   * 更改状态
   * @param {StateEnum} state
   * @returns {boolean}
   */
  private changeState(state: StateEnum): boolean {
    Utils.debugLog('to state: ' + state);
    if (state < this.state && state != StateEnum.UNOCCUPIED) {
      console.error('illegal state change');
      return false;
    }
    this.state = state;
    return true;
  }

  //endregion

  /**
   * 清除toast
   */
  private async clearToast(toast) {
    if (!Utils.isNullOrUndefined(toast)) {
      await toast.dismiss();
      toast = null;
    }
  }

  /**
   * 清除timeout计时器
   * @param timer
   */
  private clearTimeoutTimer(timer) {
    if (!Utils.isNullOrUndefined(timer)) {
      clearTimeout(timer);
      timer = null;
    }
  }

  private static throwError(message) {
    throw new (function () {
      this.toString = function () {
        return message;
      };
    })();
  }
}

enum StateEnum {
  UNOCCUPIED,
  WAITING,
  RECORDING,
  CONVERTING
}

interface AudioOption {
  size: number;
  buffer;
  inputSampleRate;
  inputSampleBits;
  outputSampleRate;
  outputSampleBits;
  input?;
  compress?;
  encodeWAV?;
}
