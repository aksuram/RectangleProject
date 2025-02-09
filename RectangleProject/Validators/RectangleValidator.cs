using RectangleProject.Entities;

namespace RectangleProject.Validators
{
    public class RectangleValidator
    {
        public RectangleValidator()
        {
        }

        public async Task<string> ValidateAsync(Rectangle rectangle)
        {
            string errorMessage = "";
            await Task.Delay(10000);

            if (rectangle == null)
            {
                errorMessage = "An unknown error occured serverside";
                return errorMessage;
            }

            if (rectangle.Width < 2.0 || rectangle.Height < 2.0)
            {
                errorMessage = "Rectangle's width or height should be at least 2 units long";
            }

            if (rectangle.Width > rectangle.Height)
            {
                errorMessage = "Rectangle's width can not exceed its height";
            }

            return errorMessage;
        }
    }
}
