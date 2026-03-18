using WEB.Components;
using WEB.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// HttpClient for API
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri("http://localhost:5199/") // <-- API URL
});

// Your API wrapper
builder.Services.AddScoped<ApiClient>();

var app = builder.Build();

// Configure pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseAntiforgery();

// Map Blazor
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();