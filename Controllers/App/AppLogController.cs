using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web.service.Models;

namespace web.service.Controllers.App
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppLogController : ControllerBase
    {
        [HttpGet("/log")]
        public async Task LogClinet()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var websocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                APPWebsocketMiddleware.ClientJoin(APPWebsocketMiddleware.CLIENT_TYPE.LOG, websocket);
                while (true)
                {
                    byte[] buffer = new byte[1024];
                    await websocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                }
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }
    }
}
