using GPM.Middleware.Core.Models.Communication.Websocket;
using GPM.Middleware.Core.Utility;
using System.Net.WebSockets;
using web.service.Models.APPState;
using System.Text.Json;
using System.Text;

namespace web.service.Models
{
    public class APPWebsocketMiddleware
    {
        public enum CLIENT_TYPE
        {
            LOG,
            APP_STATES
        }

        public static Dictionary<CLIENT_TYPE, List<WebSocket>> webSockets = new Dictionary<CLIENT_TYPE, List<WebSocket>>()
        {
            { CLIENT_TYPE.LOG,new List<WebSocket>() },
            {CLIENT_TYPE.APP_STATES,new List<WebSocket>() }
        };
        public static void ClientJoin(CLIENT_TYPE clientType, WebSocket client)
        {
            webSockets[clientType].Add(client);
        }

        public static void ClientRemove(CLIENT_TYPE clientType, WebSocket client)
        {
            webSockets[clientType].Remove(client);
        }

        public static async Task BrocastMessage(CLIENT_TYPE clientType, string message)
        {

            if (webSockets.Count == 0)
                return;

            clsBrocastMessage brocastMessage = new clsBrocastMessage(DateTime.Now, message);
            ArraySegment<byte> ArraySegment = brocastMessage.GetArraySegment();
            foreach (var client in webSockets[clientType])
            {
                try
                {
                    await client.SendAsync(ArraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                }
                catch (Exception ex)
                {
                    if (client.State != WebSocketState.Open)
                    {
                        webSockets[clientType].Remove(client);
                    }
                }
            }
        }

        /// <summary>
        /// 廣播系統狀態資訊
        /// </summary>
        /// <returns></returns>
        public static async Task BrocastAppState()
        {
            clsAppStates appStates = APPSTATEHelper.CollectAppStateData();
            string json = JsonSerializer.Serialize(appStates);

            ArraySegment<byte> ArraySegment = new ArraySegment<byte>(Encoding.ASCII.GetBytes(json));

            foreach (var client in webSockets[CLIENT_TYPE.APP_STATES])
            {
                try
                {
                    await client.SendAsync(ArraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                }
                catch (Exception ex)
                {
                    if (client.State != WebSocketState.Open)
                    {
                        webSockets[CLIENT_TYPE.APP_STATES].Remove(client);
                    }
                }
            }
        }


    }
}
