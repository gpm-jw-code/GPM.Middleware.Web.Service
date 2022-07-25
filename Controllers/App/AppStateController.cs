using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web.service.Models;
using web.service.Models.APPState;

namespace web.service.Controllers.App
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppStateController : ControllerBase
    {
        ILogger _logger;

        public AppStateController(ILogger<AppStateController> logger)
        {
            _logger = logger;
        }

        [HttpGet("AppStartupTime")]
        public async Task<IActionResult> GetAppStartUpTime()
        {
            return Ok(SystemStates.StartupTime);
        }

        [HttpGet("GetAppStates")]
        public async Task<IActionResult> GetAppStates()
        {
            return Ok(APPSTATEHelper.CollectAppStateData());
        }

        /// <summary>
        /// websocket
        /// </summary>
        /// <returns></returns>
        [HttpGet("/app_states")]
        public async Task APPState()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var client = await HttpContext.WebSockets.AcceptWebSocketAsync();
                APPWebsocketMiddleware.ClientJoin(APPWebsocketMiddleware.CLIENT_TYPE.APP_STATES, client);
                while (true)
                {
                    try
                    {
                        await client.ReceiveAsync(new ArraySegment<byte>(new byte[12]), CancellationToken.None);
                    }
                    catch (Exception ex)
                    {
                        APPWebsocketMiddleware.ClientRemove(APPWebsocketMiddleware.CLIENT_TYPE.APP_STATES, client);
                        _logger.LogInformation("websocket client in [app_states] channel is closed");
                        break;
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
