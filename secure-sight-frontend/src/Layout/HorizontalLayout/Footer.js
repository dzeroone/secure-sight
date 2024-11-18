import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-white pt-12 pb-8 mt-8 border-t border-sky-500/10">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand Section */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-start">
            <div className="text-2xl font-bold text-sky-400">
              SecureSight
            </div>
            <div className="text-slate-400 text-sm mt-2">
              © {currentYear} All rights reserved
            </div>
          </div>

          {/* Links Grid */}
          <div className="w-full md:w-auto grid grid-cols-3 gap-8">
            {/* Company Links */}
            <div className="flex flex-col gap-3">
              <h5 className="text-white font-semibold text-sm uppercase">
                Company
              </h5>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  About
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Services
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Contact
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-3">
              <h5 className="text-white font-semibold text-sm uppercase">
                Legal
              </h5>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Privacy
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Terms
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Compliance
                </a>
              </div>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-3">
              <h5 className="text-white font-semibold text-sm uppercase">
                Support
              </h5>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Help
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Docs
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 text-sm">
                  Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;