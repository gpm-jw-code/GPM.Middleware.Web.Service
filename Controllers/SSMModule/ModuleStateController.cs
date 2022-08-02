using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Text;
using GPM.Middleware.Core.Models.SSM;
using gpm_vibration_module_api;

namespace web.service.Controllers.SSMModule
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleStateController : ControllerBase
    {
        [HttpGet("/module_state/{endpoint}")]
        public async Task State(string endpoint)
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

                var moduleState = SSMModuleManager.ModuleList.Values.FirstOrDefault(si => si.moduleInfo.EndPoint == endpoint);
                if (moduleState != null)
                {
                    moduleState.ssmInterface.StateMonitorUseWebsocketMiddleware.Push(webSocket);
                    while (true)
                    {
                        await Task.Delay(1);
                        byte[] buffer = new byte[1024];
                        try
                        {

                            var receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        }
                        catch (Exception)
                        {
                            moduleState.ssmInterface.StateMonitorUseWebsocketMiddleware.websocketClients.Remove(webSocket);
                            break;
                        }

                    }
                }
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }



        [HttpGet("/module_data/{endpoint}")]
        public async Task RealTimeData(string endpoint)
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

                var moduleState = SSMModuleManager.ModuleList.FirstOrDefault(si => si.Key == endpoint);
                if (moduleState.Value != null)
                {
                    moduleState.Value.ssmInterface.SensingDataUseWebsocketMiddleware.Push(webSocket);
                    moduleState.Value.ssmInterface.BrocastCurrentState();
                    while (true)
                    {
                        await Task.Delay(1);
                        byte[] buffer = new byte[1024];
                        try
                        {
                            WebSocketReceiveResult? receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        }
                        catch (Exception ex)
                        {
                            moduleState.Value.ssmInterface.SensingDataUseWebsocketMiddleware.websocketClients.Remove(webSocket);
                            break;
                        }
                    }
                }
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }
    }
}
