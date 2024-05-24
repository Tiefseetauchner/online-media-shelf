import {
  Button,
  Card,
  CardHeader,
  makeStyles,
  Title1
} from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  card: {
    width: '80%',
    maxWidth: '600px',
    marginBottom: '1rem',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
  },
});

export function HomePage() {
  const styles = useStyles();

  return (<>
    <div
      className={styles.container}>
      <Title1
        className={styles.header}>Online Media Shelf</Title1>
      <Card
        className={styles.card}>
        <CardHeader
          header={
            <span>Welcome to the Online Media Shelf</span>}
          description={
            <span>Organize and manage your media collection effortlessly.</span>}
        />
        <img
          className={styles.image}
          src="https://via.placeholder.com/600x400"
          alt="Media Shelf"/>
        <Button
          appearance="primary"
          style={{marginTop: '1rem'}}
          as={"a"}
          href="https://github.com/Tiefseetauchner/online-media-shelf">
          Visit GitHub Repository
        </Button>
      </Card>
    </div>
  </>)
}