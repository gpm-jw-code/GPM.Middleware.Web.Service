using GPM.Middleware.Core.Models;
using GPM.Middleware.Core.Models.Log;
using GPM.Middleware.Core.Utility;
using Microsoft.Extensions.FileProviders;
using web.service.Models;

#region Core function


GPM.Middleware.Core.Models.System.SysStateChangeInvoke.SystemStateOnChanged += SysStateChangeInvoke_SystemStateOnChanged;

void SysStateChangeInvoke_SystemStateOnChanged(object? sender, EventArgs e)
{
    APPWebsocketMiddleware.BrocastAppState();
}

StaUtility.Methods.LoadSysParams();
GPM.Middleware.Core.Models.System.PCStatesHelper.StartFetch(new TimeSpan(0, 0, 1));
Logger.Initialize();
GPM.Middleware.Core.Models.SSM.EmulatorHepler.CreateSSMEmulators(new List<int>() { 231, 232, 233, 234, 235, 236, 237, 238, 239, 240 });
GPM.Middleware.Core.Models.SSM.SSMModuleManager.InitializeAsync();
StaUtility.SSMserver.StartService(port: StaUtility.SysParams.TCPServerPort);
SystemStates.StartupTime = DateTime.Now;

#endregion



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
