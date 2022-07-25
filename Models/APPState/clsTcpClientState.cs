namespace web.service.Models.APPState
{
    public class clsTcpClientState
    {
        public string endPoint { get; set; }
        public TimeSpan idlingTime { get; set; }
        public string connectedTime { get; set; }
        public string lastRequestTime { get; set; }
        public string lastRequestCmd { get; set; }

    }
}
