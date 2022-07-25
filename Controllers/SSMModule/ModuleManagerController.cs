﻿using GPM.Middleware.Core.Models.SSM;
using Microsoft.AspNetCore.Mvc;
using web.service.Models;
using web.service.Models.SSM;

namespace web.service.Controllers.SSMModule
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleManagerController : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> get()
        {
            return Ok("test");
        }

        [HttpGet("ModuleList")]
        public async Task<IActionResult> GetModuleList()
        {
            return Ok(SSMModuleManager.ModuleList.Values.Select(s => s.moduleInfo).ToList());
        }

        [HttpPost("AddModule")]
        public async Task<IActionResult> AddModule([FromBody] clsModuleinfoBase test)
        {
            APPWebsocketMiddleware.BrocastMessage(APPWebsocketMiddleware.CLIENT_TYPE.LOG, $"User try add module:{test.EndPoint}");
            if (test.isIPIllegal)
                return BadRequest("IP illegal");

            SSMModuleManager.AddModule(test);
            return Ok();
        }


        [HttpPost("RemoveModule")]
        public async Task<IActionResult> RemoveModule([FromBody] clsModuleinfoBase binfo)
        {
            if (binfo.isIPIllegal)
                return BadRequest("IP illegal");
            return Ok(SSMModuleManager.Remove(binfo));
        }



        [HttpPost("StopFetchWork")]
        public async Task<IActionResult> StopFetchWork([FromBody] clsModuleinfoBase binfo)
        {
            var ssmInterface = SSMModuleManager.GetSSMInterfaceByEndPoint(binfo.EndPoint);
            if (ssmInterface != null)
            {
                ssmInterface.StopWorks();
                return Ok();
            }
            else
                return BadRequest("不存在的模組");
        }

        [HttpPost("SettingMeasureRange")]
        public async Task<IActionResult> SettingMeasureRange([FromBody] clsRaneSettingRequest req)
        {
            var ssmInterface = SSMModuleManager.GetSSMInterfaceByEndPoint(req.endpoint);
            if (ssmInterface != null)
            {
                int errorCOde = await ssmInterface.SetMeasureReage(req.Range);
                clsRangeSettingResponse response = new clsRangeSettingResponse()
                {
                    errorCode = errorCOde,
                    errorMessage = errorCOde == 404 ? "量測範圍設定值有誤" : "ERR",
                    Range = req.Range,
                    ip = req.ip,
                    port = req.port,
                };
                return Ok(response);
            }
            else
                return BadRequest("不存在的模組");
        }

    }
}
