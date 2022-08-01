namespace web.service.Models.APPState
{
    public class clsSystemSettingModel
    {
        public clsTcpClient tcpClient { get; set; } = new clsTcpClient();
        public clsServers servers { get; set; } = new clsServers();
    }


    public class clsTcpClient
    {
        public bool autoLickOutClient { get; set; } = true;
        public int connectionLimits { get; set; }
    }

    public class clsServers
    {
        public int tcpServerPort { get; set; }
    }


    public class clsSettingResult
    {
    }

}
