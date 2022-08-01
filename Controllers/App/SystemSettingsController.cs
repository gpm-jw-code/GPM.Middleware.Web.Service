using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web.service.Models.APPState;
using GPM.Middleware.Core.Utility;

namespace web.service.Controllers.App
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemSettingsController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            clsSystemSettingModel settings = new clsSystemSettingModel();
            settings.servers.tcpServerPort = StaUtility.SysParams.TCPServerPort;
            return Ok(settings);
        }



        [HttpPost]
        public async Task<IActionResult> Post([FromBody] clsSystemSettingModel settings)
        {
            //clsSystemSettingModel settings = new clsSystemSettingModel();
            StaUtility.SysParams.TCPServerPort = settings.servers.tcpServerPort;
            await TryReBuildTcpServer(settings.servers.tcpServerPort);

            StaUtility.Methods.SaveSysParams();
            return Ok(settings);
        }


        private async Task<bool> TryReBuildTcpServer(int newTcpServerPort)
        {
            if (newTcpServerPort == StaUtility.SSMserver.Port)
                return true;
            StaUtility.SSMserver.StopService();
            return await StaUtility.SSMserver.Rebuild(newTcpServerPort);
        }

    }
}
