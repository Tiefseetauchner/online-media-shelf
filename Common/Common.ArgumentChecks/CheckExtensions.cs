using System;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;

namespace DeadmanSwitchFailed.Common.ArgumentChecks;

public static class CheckExtensions
{
  // NOTE: The NotNull attribute does the heavy lifting. MemberNotNull seemingly does nothing over project boundaries
  //       I couldn't figure out why, but it works when putting it in the same project... truly odd
  [MemberNotNull("source")]
  public static T CheckNotNull<T>([NotNull] this T source, [CallerArgumentExpression("source")] string sourceName = "")
  {
    if (source is null)
      throw new ArgumentNullException(sourceName);

    return source;
  }
}