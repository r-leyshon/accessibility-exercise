import Header from "@/components/Header";
import ScrollingTicker from "@/components/ScrollingTicker";
import Disclaimer from "@/components/Disclaimer";
import ChatWindow from "@/components/ChatWindow";
import BugTracker from "@/components/BugTracker";

/**
 * INTENTIONAL DESIGN SINS:
 * - Illogical layout: disclaimer between input and messages
 * - Inconsistent spacing throughout
 * - No visual hierarchy
 * - Overlapping elements (BugTracker overlaps content)
 *
 * INTENTIONAL ACCESSIBILITY BUG:
 * - Inconsistent Ivysaur (3.2.3): nav order differs from /gallery
 */

export default function Home() {
  return (
    <div>
      <Header />
      <ScrollingTicker />
      <Disclaimer />
      <ChatWindow />
      <BugTracker />
    </div>
  );
}
