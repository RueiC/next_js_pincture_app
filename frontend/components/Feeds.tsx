import { MasonryLayout, NoResult } from "../components";
import { PinItem } from "../types";

interface Props {
  pins: PinItem[];
}

const Feeds = ({ pins }: Props) => {
  return <>{pins ? <MasonryLayout pins={pins} /> : <NoResult />}</>;
};

export default Feeds;
