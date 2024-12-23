#region

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Tiefseetauchner.OnlineMediaShelf.Domain.Models;
using Tiefseetauchner.OnlineMediaShelf.Web.WebObjects;

#endregion

namespace Tiefseetauchner.OnlineMediaShelf.Web.Controllers;

[ApiController]
[Route("accountextension")]
public class AccountController(
  UserManager<ApplicationUser> userManager,
  SignInManager<ApplicationUser> signInManager)
  : ControllerBase
{
  private readonly static EmailAddressAttribute s_emailAddressAttribute = new();

  // NOTE (Tiefseetauchner): This follows the source code of aspnetcore/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs
  [HttpPost("register")]
  public async Task<Results<Ok, ValidationProblem>> Register([FromBody] RegisterModel model)
  {
    if (!userManager.SupportsUserEmail)
      throw new NotSupportedException($"{nameof(Register)} requires a user store with email support.");

    if (string.IsNullOrEmpty(model.Email) || !s_emailAddressAttribute.IsValid(model.Email))
      return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(model.Email)));

    var user = new ApplicationUser
    {
      Email = model.Email,
      UserName = model.Username,
      SignUpDate = DateTime.Now
    };
    var result = await userManager.CreateAsync(user, model.Password);

    if (!result.Succeeded)
      return CreateValidationProblem(result);

    return TypedResults.Ok();
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginModel model)
  {
    var user = await userManager.FindByEmailAsync(model.UsernameOrEmail)
               ?? await userManager.FindByNameAsync(model.UsernameOrEmail);

    if (user == null)
      return BadRequest("Invalid login attempt");

    var result = await signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, lockoutOnFailure: false);

    if (result.Succeeded)
      return Ok("Logged in successfully");

    if (result.IsLockedOut)
      return BadRequest("User account locked");

    return BadRequest("Invalid login attempt");
  }

  [HttpGet("renew-token")]
  public async Task<IActionResult> RenewToken()
  {
    var identity = User.Identities.First();

    if (!identity.IsAuthenticated)
      return Unauthorized();

    var applicationUser = await userManager.GetUserAsync(User);

    if (applicationUser == null)
      return Unauthorized();

    await signInManager.RefreshSignInAsync(applicationUser);

    return Ok();
  }

  [HttpGet("logout")]
  public async Task<IActionResult> Logout()
  {
    await signInManager.SignOutAsync();

    return Ok();
  }

  [HttpPost("change-password")]
  public async Task<IActionResult> ChangePassword([FromBody] UpdatePasswordModel model)
  {
    if (!User.Identities.First().IsAuthenticated)
      return Unauthorized();

    var user = await userManager.GetUserAsync(User);

    if (user == null)
      return BadRequest("Unknown user.");

    var signInResult = await signInManager.CheckPasswordSignInAsync(user, model.OldPassword, false);

    if (!signInResult.Succeeded)
      return Unauthorized();

    var result = await userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

    if (!result.Succeeded)
      return BadRequest(CreateValidationProblem(result));

    return Ok();
  }

  [HttpPost("change-user-data")]
  public async Task<IActionResult> ChangeUserData([FromBody] ChangeUserDataModel model)
  {
    if (!User.Identities.First().IsAuthenticated)
      return Unauthorized();

    var userNameFromClaim = User.Identities.First().Name;

    if (userNameFromClaim == null)
      return BadRequest("Unknown user.");

    var user = await userManager.FindByNameAsync(userNameFromClaim);

    if (user == null)
      return BadRequest("Unknown user.");

    user.Email = model.Email;
    user.UserName = model.UserName;

    var result = await userManager.UpdateAsync(user);

    return Ok(result);
  }

  [HttpGet("current-user")]
  public async Task<ActionResult<CurrentUserModel>> GetCurrentUser()
  {
    var userIsAuthenticated = User.Identities.First().IsAuthenticated;

    if (!userIsAuthenticated)
      return Ok(new CurrentUserModel(false, null, "", DateTime.MinValue, []));

    var user = await userManager.GetUserAsync(User);

    if (user == null)
      return Ok(new CurrentUserModel(false, null, "", DateTime.MinValue, []));

    return Ok(new CurrentUserModel(true, user.UserName, user.Id, user.SignUpDate, user.Shelves.Select(Mapper.ConvertToWebObject).ToList()));
  }

  [HttpGet("current-user/information")]
  public async Task<ActionResult<ApplicationUser>> GetCurrentUserInformation()
  {
    var userIsAuthenticated = User.Identities.First().IsAuthenticated;

    if (!userIsAuthenticated)
      return Ok(new CurrentUserModel(false, null, "", DateTime.MinValue, []));

    var userNameFromClaim = User.Identities.First().Name;

    if (userNameFromClaim == null)
      return StatusCode(500, "Error when loading Username from Claim");

    var user = await userManager.FindByNameAsync(userNameFromClaim);

    return Ok(user);
  }

  // NOTE (Tiefseetauchner): From aspnetcore/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs
  private static ValidationProblem CreateValidationProblem(string errorCode, string errorDescription) =>
    TypedResults.ValidationProblem(new Dictionary<string, string[]>
    {
      { errorCode, [errorDescription] }
    });

  // NOTE (Tiefseetauchner): From aspnetcore/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs
  private static ValidationProblem CreateValidationProblem(IdentityResult result)
  {
    var errorDictionary = new Dictionary<string, string[]>(1);

    foreach (var error in result.Errors)
    {
      string[] newDescriptions;

      if (errorDictionary.TryGetValue(error.Code, out var descriptions))
      {
        newDescriptions = new string[descriptions.Length + 1];
        Array.Copy(descriptions, newDescriptions, descriptions.Length);
        newDescriptions[descriptions.Length] = error.Description;
      }
      else
      {
        newDescriptions = [error.Description];
      }

      errorDictionary[error.Code] = newDescriptions;
    }

    return TypedResults.ValidationProblem(errorDictionary);
  }
}