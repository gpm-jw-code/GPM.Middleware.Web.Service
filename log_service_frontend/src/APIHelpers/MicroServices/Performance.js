import axios from 'axios'

export async function GetPCPerformance(edge_ip){
    var ret =  await axios.get(`http://${edge_ip}:81/api/Performance`);
    return ret.data;
}
 