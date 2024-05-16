namespace Tiefseetauchner.OnlineMediaShelf.Domain;

public interface IEntity<TKey>
{
  TKey Id { get; }
}