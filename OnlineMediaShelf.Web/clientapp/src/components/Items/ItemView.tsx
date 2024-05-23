import {
  useParams
} from "react-router-dom";
import {
  useEffect,
  useState
} from "react";
import {
  IItemModel,
  ItemClient
} from "../../OMSWebClient.ts";

import {
  Divider,
  makeStyles,
  shorthands,
  Text,
  useToastController
} from "@fluentui/react-components";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.padding('20px'),
    ...shorthands.margin('20px'),
  },
  coverImage: {
    width: '150px',
    height: '220px',
    objectFit: 'cover',
    ...shorthands.margin('0', '0', '15px'),
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: '1.5em',
    ...shorthands.margin('0', '0', '5px'),
  },
  author: {
    fontStyle: 'italic',
    ...shorthands.margin('0', '0', '15px'),
  },
  description: {
    whiteSpace: "pre-wrap",
    ...shorthands.margin('0', '0', '15px'),
  },
  reviewsContainer: {
    width: '100%',
    textAlign: 'left',
  },
  reviewItem: {
    ...shorthands.margin('0', '0', '10px'),
  },
  reviewer: {
    fontWeight: 'bold',
  },
  stars: {
    color: '#ffb400',
  },
});

export function ItemView() {
  const styles = useStyles();
  const [item, setItem] = useState<IItemModel>({})

  const {itemId} = useParams();

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateItem() {
      if (itemId === undefined || !isNumeric(itemId)) {
        showErrorToast(`Item with id '${itemId}' could not be parsed.`, dispatchToast)
        return;
      }

      try {
        let client = new ItemClient();

        let result = await client.getItem(parseInt(itemId));

        setItem(result);
      } catch {
        showErrorToast(`Item with id '${itemId}' could not be loaded.`, dispatchToast)
      }
    }

    populateItem();
  }, []);

  // const renderStars = (rating: number) => {
  //   return '⭐'.repeat(rating);
  // };

  return (
    <div
      className={styles.container}>
      {/*item.coverImage && (
        <Image
          className={styles.coverImage}
          src={item.coverImage}
          alt={`${item.title} cover`}/>
      )*/}
      <Text
        className={styles.bookTitle}>{item.title}</Text>
      <Text
        className={styles.author}>by {/*item.author*/}</Text>
      <Divider/>
      <Text
        className={styles.description}>{item.description}</Text>
      {/*item.reviews && item.reviews.length > 0 && (
        <div
          className={styles.reviewsContainer}>
          <Text
            variant="medium">Reviews:</Text>
          {item.reviews.map((review, index) => (
            <div
              key={index}
              className={styles.reviewItem}>
              <Text
                className={styles.reviewer}>{review.reviewer}</Text>
              <Text
                className={styles.stars}>{renderStars(review.rating)}</Text>
              {review.reviewText &&
                  <Text>{review.reviewText}</Text>}
            </div>
          ))}
        </div>
      )*/}
    </div>
  );
}

