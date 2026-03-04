import LoadingScreen from '../LoadingScreen';

export default function LoadingScreenExample() {
  return (
    <LoadingScreen onLoadingComplete={() => console.log('Loading complete')} />
  );
}