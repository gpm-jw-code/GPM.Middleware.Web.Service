using GPM.Middleware.Core.Utility;

namespace web.service.Models.APPState
{
    public class APPSTATEHelper
    {
        public static clsAppStates CollectAppStateData()
        {
            GPM.Middleware.Core.Models.Communication.clsServer.Client[]? ar = StaUtility.ControlMiddleware.tcpClientRecords.Keys.ToArray();
            clsAppStates appStates = new clsAppStates();
            appStates.startupTime = SystemStates.StartupTime;
            appStates.pcState = GPM.Middleware.Core.Models.System.PCStatesHelper.pcState;
            appStates.ssmNumber = GPM.Middleware.Core.Models.SSM.SSMModuleManager.ModuleList.Count;

            foreach (GPM.Middleware.Core.Models.Communication.clsServer.Client client in ar)
                appStates.tcpClientState.Add(new clsTcpClientState
                {
                    endPoint = client.EndPoint,
                    connectedTime = client.connectedTime.ToString("yyyy/MM/dd HH:mm:ss"),
                    lastRequestTime = client.lastRequestTime.ToString("yyyy/MM/dd HH:mm:ss"),
                    lastRequestCmd = client.lastRequestCmd
                });

            return appStates;
        }
    }
}
