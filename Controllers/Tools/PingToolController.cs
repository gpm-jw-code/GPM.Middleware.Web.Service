using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;

namespace web.service.Controllers.Tools
{
    [Route("api/[controller]")]
    [ApiController]
    public class PingToolController : ControllerBase
    {
        [HttpGet("/ping/{ip}")]
        public async Task Ping(string ip)
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var clientWs = await HttpContext.WebSockets.AcceptWebSocketAsync();

                if (!IPAddress.TryParse(ip, out IPAddress address))
                {
                    await clientWs.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes("IP Format Incorrect")),
                          System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                    clientWs.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.InvalidPayloadData,
                        "IP 格式異常", CancellationToken.None);
                    return;
                }

                bool stopFlag = false;
                while (!stopFlag)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(1));
                    PingReply reply = GPM.Middleware.Core.Utility.Tools.PingAddress(ip);
                    bool success = reply != null && reply.Status == IPStatus.Success;
                    string pingResult = "";
                    if (success)
                    {
                        pingResult = $"From {reply.Address}:Bytes={reply.Buffer.Count()} Time={reply.RoundtripTime}ms TTL={reply.Options.Ttl}";
                    }
                    else
                    {
                        pingResult = reply.Status.ToString();
                    }

                    try
                    {
                        ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
                        var res = clientWs.ReceiveAsync(buffer, CancellationToken.None).ContinueWith((tak) =>
                        {
                            string msg = Encoding.ASCII.GetString(buffer).Replace("\0", "");
                            if (msg.ToUpper() is "STOP")
                                stopFlag = true;
                        });


                        await clientWs.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes($"{pingResult}")),
                             System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);

                    }
                    catch (Exception ex)
                    {
                        stopFlag = true;
                    }
                }

            }
        }

    }
}
