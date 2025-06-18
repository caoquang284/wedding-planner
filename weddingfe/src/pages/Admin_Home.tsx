import React, { useState } from "react";
import YouTube from "react-youtube";

const Admin_Home = () => {
  const [player, setPlayer] = useState(null);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: "k1gj5wCLAhc",
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  const onError = (error: any) => {
    console.error("YouTube Player Error:", error);
  };

  return (
    <div className="h-screen w-full bg-gray-100">
      <div className="relative h-full w-full overflow-hidden">
        <YouTube
          videoId="k1gj5wCLAhc"
          opts={opts}
          className="absolute top-0 left-0 w-full h-full"
          iframeClassName="w-full h-full object-cover"
          onReady={onReady}
          onError={onError}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* chu nho */}
            <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              Chào mừng đến với Nhà hàng Tiệc Cưới Hạnh Phúc
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-5xl mx-auto">
              Nhà hàng Tiệc Cưới Hạnh Phúc là nơi biến giấc mơ về một lễ cưới
              hoàn hảo của bạn thành hiện thực. Với không gian sang trọng, thực
              đơn đa dạng, và dịch vụ chuyên nghiệp, chúng tôi cam kết mang đến
              cho bạn một ngày trọng đại trọn vẹn và đáng nhớ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Home;
