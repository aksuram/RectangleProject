using Microsoft.AspNetCore.Mvc;
using RectangleProject.Entities;
using RectangleProject.Services;
using RectangleProject.Validators;
using System.Net.Mime;
using System.Text;

namespace RectangleProject.Controllers
{
    [ApiController]
    public class RectangleController : ControllerBase
    {
        private readonly RectangleValidator _rectangleValidator;
        private readonly FileService _fileService;

        public RectangleController(RectangleValidator rectangleValidator, FileService fileService)
        {
            _rectangleValidator = rectangleValidator;
            _fileService = fileService;
        }

        [HttpPost("api/rectangle/")]
        public async Task<ActionResult> ValidateAndSaveRectangle([FromBody] Rectangle rectangle)
        {
            string errorMessage = await _rectangleValidator.ValidateAsync(rectangle);

            if (errorMessage != "") return BadRequest(new { ErrorMessage = errorMessage });
            
            errorMessage = await _fileService.SaveJSONRectangle(rectangle);

            if (errorMessage == "") return Ok();

            return BadRequest(new { ErrorMessage = errorMessage });
        }

        [HttpGet("api/rectangle/")]
        public async Task<ActionResult> GetRectangle()
        {
            var (rectangle, errorMessage) = await _fileService.ReadJSONRectangle();

            if (errorMessage == "" && rectangle != null) return Ok(rectangle);

            return BadRequest(new { ErrorMessage = errorMessage });
        }
    }
}
