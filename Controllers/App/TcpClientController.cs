using GPM.Middleware.Core.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace web.service.Controllers.App
{
    [Route("api/[controller]")]
    [ApiController]
    public class TcpClientController : ControllerBase
    {

        [HttpGet("KickOut/{endPoint}")]
        public async Task<IActionResult> Kick(string endPoint)
        {
            return Ok(StaUtility.ControlMiddleware.KickOut(endPoint));
        }
    }
}
