using Microsoft.AspNetCore.Http;
using RectangleProject.Entities;
using System.Text.Json;

namespace RectangleProject.Services
{
    public class FileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string> SaveJSONRectangle(Rectangle rectangle)
        {
            string errorMessage = "";
            try
            {
                using (StreamWriter streamWriter = new StreamWriter(Path.Combine(_webHostEnvironment.ContentRootPath, "Data", "Rectangle.json"),
                    new FileStreamOptions { Mode = FileMode.Create, Access = FileAccess.Write }))
                {
                    await streamWriter.WriteLineAsync(JsonSerializer.Serialize(rectangle));
                }
            }
            catch (Exception)
            {
                errorMessage = "Could not save rectangle as a JSON file";
                throw;
            }

            return errorMessage;
        }

        public async Task<(Rectangle?, string errorMessage)> ReadJSONRectangle()
        {
            string errorMessage = "";
            Rectangle? rectangle = null;
            try
            {
                using (StreamReader streamReader = new StreamReader(Path.Combine(_webHostEnvironment.ContentRootPath, "Data", "Rectangle.json"),
                    new FileStreamOptions { Mode = FileMode.Open, Access = FileAccess.Read }))
                {
                    rectangle = JsonSerializer.Deserialize<Rectangle>(await streamReader.ReadToEndAsync());
                }
            }
            catch (Exception)
            {
                errorMessage = "Could not get rectangle from the JSON file";
            }

            return (rectangle, errorMessage);
        }
    }
}
