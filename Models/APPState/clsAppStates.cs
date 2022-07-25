using static GPM.Middleware.Core.Models.System.PCStatesHelper;

namespace web.service.Models.APPState
{
    public class clsAppStates
    {
        public DateTime startupTime { get; set; }
        public List<clsTcpClientState> tcpClientState { get; set; } = new List<clsTcpClientState>();
        public clsPCState pcState { get; set; } = new clsPCState();
    }
}
