class WBST {
  constructor(obj) {
    /**
     * websocket接口地址
     * 1、http请求还是https请求 前缀不一样
     * 2、ip地址host
     * 3、端口号
     * */
    const config = obj || {}
    const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
    const host = window.location.host
    const port = ':8080'
    // 接口地址url
    this.url = config.url || protocol + host + port
    // socket对象
    this.socket = null
    // 心跳状态  为false时不能执行操作 等待重连
    this.isHeartflag = false
    // 重连状态  避免不间断的重连操作
    this.isReconnect = false
    // 重连次数
    this.reconnectionTime = 0
    // 最大重连次数
    this.maxReconnectionTime = 3
    // 自定义Ws连接函数：服务器连接成功
    this.onopen = (e) => {
      console.info('websocket =====开始建立连接=====')
      this.isHeartflag = true
      if (this.reconnectionTime > 0) {
        this.bolt()
      }
    }
    // 自定义Ws消息接收函数：服务器向前端推送消息时触发
    this.onmessage = (e) => {
      // console.log(e)
    }
    // 自定义Ws异常事件：Ws报错后触发
    this.onerror = (e) => {
      console.info('websocket =====连接报错=====', e)
      this.isHeartflag = false
      this.reConnect()
    }
    // 自定义Ws关闭事件：Ws连接关闭后触发
    this.onclose = (e) => {
      this.reConnect()
      console.info('websocket =====关闭连接=====')
    }
    // 断线重连
    this.bolt = () => {
      console.log('=====断线重连接====')
    }
    this.initWs()
  }
  // 连接初始化

  initWs() {
    window.WebSocket = window.WebSocket || window.MozWebSocket
    if (!window.WebSocket) {
      // 检测浏览器支持
      console.error('错误: 浏览器不支持websocket')
      return
    }
    const self = this

    this.socket = new WebSocket(this.url) // 创建连接并注册响应函数
    this.socket.onopen = function (e) {
      self.onopen(e)
    }
    this.socket.onmessage = function (e) {
      self.onmessage(e)
    }
    this.socket.onclose = function (e) {
      self.onclose(e)
      // 清理
      self.socket = null
      this.reconnectionTime = 10
    }
    this.socket.onerror = function (e) {
      self.onerror(e)
    }
    return this
  }
  // 主动关闭连接

  reClose() {
    console.log('主动断掉连接')
    this.isReconnect = true
    this.reconnectionTime = 10
    this.socket.close()
  }
  // 断线重连

  reConnect() {
    if (this.isReconnect) return
    this.isReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    this.reconnectionTime++
    if (this.reconnectionTime < this.maxReconnectionTime) {
      setTimeout(() => {
        this.initWs()
        this.isReconnect = false
      }, 5000)
    } else {
      this.isReconnect = true
      console.info('websocket =====重连关闭=====')
    }
  }
  // 消息发送

  sendMsg(obj) {
    this.socket.send(JSON.stringify(obj))
  }
}

export { WBST }
