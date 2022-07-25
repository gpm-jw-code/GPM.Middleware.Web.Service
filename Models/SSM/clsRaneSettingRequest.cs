namespace web.service.Models.SSM
{
    public class clsRaneSettingRequest
    {
        public int Range { get; set; }
        public string ip { get; set; } = "";
        public int port { get; set; } = 1;

        internal string endpoint => $"{ip}:{port}";
    }

    public class clsRangeSettingResponse : clsRaneSettingRequest
    {
        public int errorCode { get; set; }
        public string errorMessage { get; set; }
    }
}
