/**
 * Created by ajaygaur on 25/06/17.
 */

import axios from 'axios';

const lookupUtils = {
  lookupById: function (lookupReqObj) {
    return axios.post(`${lookupAPIPath}`, lookupReqObj);
  },

  lookupByDimension: (lookupRequest) => {
    return axios.post('http://localhost:3002/v1/bulkLookUp', lookupRequest);
  },
};


export default lookupUtils;