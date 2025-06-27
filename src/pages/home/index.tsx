import { useContext } from "react";

import { AppContext } from "@context/AppContext";
import { useMediaQuery } from "@inubekit/inubekit";

import { HomeUI } from "./interface";

const Home = () => {
  const { eventData } = useContext(AppContext);
  const SmallScreen = useMediaQuery("(max-width: 532px)");
  const Username = eventData.user.userName.split(" ")[0];

  return (
    <HomeUI
      smallScreen={SmallScreen}
      username={Username}
      eventData={eventData}
    />
  );
};

export { Home };
