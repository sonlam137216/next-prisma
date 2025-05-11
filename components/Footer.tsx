import Link from "next/link"

import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div>
                <div className="text-2xl font-bold leading-tight">CÔNG TY TNHH GEM PHONG THUY</div>
              </div>
            </div>
            <p className="mb-2 text-sm">
              Mắt Việt tự hào là chuỗi bán lẻ kính mắt chính hãng tại thị trường Việt Nam từ năm 1989.
            </p>
            <p className="mb-2 text-sm">
              Hệ thống hơn 30 cửa hàng từ Bắc chí Nam tại các trung tâm thương mại lớn và các con đường sầm uất.
            </p>
            <p className="mb-2 text-sm">
              Điểm đến tin cậy để đo mắt và tư vấn thị lực theo tiêu chuẩn quốc tế bằng những dịch vụ chăm sóc khách hàng tận tâm, chuyên nghiệp.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <div className="font-bold mb-2">THÔNG TIN LIÊN HỆ</div>
            <div className="text-sm mb-1">- SH1-08 Khu Đô Thị Sala, 153 Nguyễn Cơ Thạch ,<br/>Phường An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh, Việt Nam.</div>
            <div className="text-sm mb-1">- Điện thoại: 028 73006061</div>
            <div className="text-sm mb-1">- Email: cskh@matviet.vn</div>
            <div className="flex items-center mt-2">
              <span className="bg-yellow-400 text-[#062366] font-bold px-4 py-2 rounded flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#062366" strokeWidth="2" d="M6.5 7.5A5.5 5.5 0 0 1 12 2a5.5 5.5 0 0 1 5.5 5.5c0 2.5-1.5 4.5-5.5 9.5-4-5-5.5-7-5.5-9.5Z"/><circle cx="12" cy="7.5" r="1.5" fill="#062366"/></svg>
                Hotline: <span className="text-xl">19006081</span>
              </span>
            </div>
          </div>

          {/* About & Policy */}
          <div>
            <div className="font-bold mb-2">VỀ MẮT VIỆT</div>
            <div className="text-sm mb-1"><Link href="#">Giới Thiệu Mắt Việt</Link></div>
            <div className="text-sm mb-1"><Link href="#">Hệ thống cửa hàng</Link></div>
            <div className="font-bold mt-4 mb-2">CHÍNH SÁCH</div>
            {/* <div className="text-sm mb-1"><Link href="#">Điều khoản dịch vụ</Link></div> */}
            {/* <div className="text-sm mb-1"><Link href="#">Chính sách thanh toán</Link></div> */}
            <div className="text-sm mb-1"><Link href="#">Chính sách giao hàng</Link></div>
            <div className="text-sm mb-1"><Link href="#">Chính sách đổi trả</Link></div>        </div>

          {/* Customer Support */}
          <div>

          <div>
            <div className="font-bold mb-2">HỖ TRỢ KHÁCH HÀNG</div>
            <div className="text-sm mb-1"><Link href="#">Liên hệ</Link></div>
          </div>
          <div className="mt-4">
            <div className="font-bold mb-2">KẾT NỐI VỚI MẮT VIỆT</div>
            <div className="flex justify-start gap-4 text-2xl">
              <Link href="#" className="flex items-center gap-1">
                <FaFacebook />
              </Link>
              <Link href="#" className="flex items-center gap-1">
                <FaInstagram />
              </Link>
              <Link href="#" className="flex items-center gap-1">
                <FaTiktok />
              </Link>
              <Link href="#" className="flex items-center gap-1">
                <FaYoutube />
              </Link>
            </div>
          </div>
          </div>
        </div>

        <div className="border-t border-white/20 my-8"></div>
      </div>
    </footer>
  )
}

