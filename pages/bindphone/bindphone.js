
let timer; //定时器

Page({
  data: {
    being: false,
    time: 5
  },

  bindsubmit() {
    console.log(1)
  },

  //绑定倒计时事件
  handleGetVerf() {
    let self = this;
    if (!this.data.being) {
      this.setData({
        being: true
      });
      timer = setInterval(function() {
        let tempTime = self.data.time;
        if (tempTime == 0) {
        	clearInterval(timer);
          self.setData({
            being: false
          });
          console.log(self.data.being)
          return;
        }
        self.setData({
          time: tempTime - 1
        });
      }, 1000);
    }
  }
})