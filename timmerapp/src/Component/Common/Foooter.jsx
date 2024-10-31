import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-9">
    <div className="container mx-auto text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
      <p className="text-xs">
        Powered by React | Made with  Sathpriyan E❤️
      </p>
    </div>
  </footer>  );
}
