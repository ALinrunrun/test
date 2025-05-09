// web/js/sensor.js
window.addEventListener('DOMContentLoaded', () => {
    const socket = io("http://192.168.5.182:5000");   // 改成树莓派实际 IP+端口
  
    socket.on('sensor', data => {
      // 若元素还没渲染，可以放在 DOMContentLoaded 回调里确保已存在
      document.getElementById('d1').textContent = data.d1.toFixed(3);
      document.getElementById('d2').textContent = data.d2.toFixed(3);
    });
  });
  