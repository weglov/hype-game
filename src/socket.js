import config from 'config/config.js';
import voxelStore from 'config/voxelStore.js';
import createGame, { user } from './main.js';
import _ from 'lodash';
import { alert } from 'notie';

let socket;

async function loadVoxels(data) {
  await Promise.all(data.map(
    async (val) => {
      await game.createBlock([val.x, val.z, val.y], val.owner);
    }
  ));
}

const start = () => {
  socket = new WebSocket(config.ws.url);
  socket.onclose = () => setTimeout(start, 5000);

  socket.sendWs = (type = 'range', args) => {
    const data = {
      type,
      args,
    };
  
    socket.send(JSON.stringify(data));
  };

  socket.onmessage = (res) => {
    const data = JSON.parse(res.data);
    const error = _.get(data, 'error.message');
  
    if (error) {
      alert({
        type: 'error',
        text: error,
        position: 'bottom',
      });
    }

    if (data.meta.type === 'update') {
      const voxel = data.data;
      console.log(voxel);
      game.createBlock([voxel.x, voxel.z, voxel.y], voxel.owner);
    }

    if (data.meta.type === 'range') loadVoxels(data.data);
  };

  socket.onopen = () => {
    if (_.isUndefined(window.game)) {
      createGame();
      setTimeout(() => game.showAllChunks(), 500);
    }

    const userPositon = user.getPosition();
    const range = config.ws.range;

    socket.send(socket.sendWs('range', { x: userPositon.x, y: userPositon.y, range }));
  }
}

start();


export default socket;
