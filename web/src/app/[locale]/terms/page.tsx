import { type Metadata } from 'next';
import { getDictionary } from '~/lib/dictionary';
import { bannerService } from '~/services';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: dict.terms.title,
    description: dict.terms.description
  };
}

async function TermsPage({ params }: Props) {
  const { locale } = await params;

  const [dict, images] = await Promise.all([
    getDictionary(locale),
    bannerService.get('privacy')
  ]);

  return (
    <>
      <div
        className='w-full flex justify-center items-center aspect-4/1 bg-cover bg-center'
        style={{
          backgroundImage: images?.[0] ? `url(${images[0]})` : undefined
        }}
      >
        <h1 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
          {dict.terms.title}
        </h1>
      </div>
      <div className='container space-y-6 my-16'>
        <h1 className='text-accent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
          {dict.terms.title}
        </h1>
        {locale === 'vi' ? (
          <>
            <p className='text-lg font-medium'>
              Khi quý khách truy cập vào trang web của chúng tôi có nghĩa là quý
              khách đồng ý với các điều khoản này. Trang web có quyền thay đổi,
              chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và
              Điều kiện sử dụng, vào bất cứ lúc nào. Các thay đổi có hiệu lực
              ngay khi được đăng trên trang web mà không cần thông báo trước. Và
              khi quý khách tiếp tục sử dụng trang web, sau khi các thay đổi về
              quy định và điều kiện được đăng tải, có nghĩa là quý khách chấp
              nhận với những thay đổi đó.
              <br />
              <br />
              Quý khách vui lòng kiểm tra thường xuyên để cập nhật những thay
              đổi của chúng tôi.
            </p>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                1. Hướng dẫn sử dụng web
              </h2>
              <p className='text-lg font-medium'>
                Khi vào web của chúng tôi, người dùng tối thiểu phải 18 tuổi
                hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp
                pháp.
                <br />
                <br />
                - Chúng tôi cấp giấy phép sử dụng để bạn có thể mua sắm trên web
                trong khuôn khổ điều khoản và điều kiện sử dụng đã đề ra.
                <br />
                <br />
                - Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục
                đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu
                không được chúng tôi cho phép bằng văn bản. Nếu vi phạm bất cứ
                điều nào trong đây, chúng tôi sẽ hủy giấy phép của bạn mà không
                cần báo trước.
                <br />
                <br />
                - Trang web này chỉ dùng để cung cấp thông tin sản phẩm chứ
                chúng tôi không phải nhà sản xuất nên những nhận xét hiển thị
                trên web là ý kiến cá nhân của khách hàng, không phải của chúng
                tôi.
                <br />
                <br />
                - Quý khách phải đăng ký tài khoản với thông tin xác thực về bản
                thân và phải cập nhật nếu có bất kỳ thay đổi nào. Mỗi người truy
                cập phải có trách nhiệm với mật khẩu, tài khoản và hoạt động của
                mình trên web. Hơn nữa, quý khách phải thông báo cho chúng tôi
                biết khi tài khoản bị truy cập trái phép. Chúng tôi không chịu
                bất kỳ trách nhiệm nào, dù trực tiếp hay gián tiếp, đối với
                những thiệt hại hoặc mất mát gây ra do quý khách không tuân thủ
                quy định.
                <br />
                <br />- Trong suốt quá trình đăng ký, quý khách đồng ý nhận
                email quảng cáo từ website. Sau đó, nếu không muốn tiếp tục nhận
                mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở
                dưới cùng trong mọi email quảng cáo.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                2. Chấp nhận đơn hàng và giá cả
              </h2>
              <p className='text-lg font-medium'>
                - Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách vì
                bất kỳ lý do gì vào bất kỳ lúc nào. Chúng tôi có thể hỏi thêm về
                số điện thoại và địa chỉ trước khi nhận đơn hàng.
                <br />
                <br />- Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác
                nhất cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy
                ra, ví dụ như trường hợp giá sản phẩm không hiển thị chính xác
                trên trang web hoặc sai giá, tùy theo từng trường hợp chúng tôi
                sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho quý
                khách. Chúng tôi cũng có quyền từ chối hoặc hủy bỏ bất kỳ đơn
                hàng nào dù đơn hàng đó đã hay chưa được xác nhận hoặc đã bị
                thanh toán.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                3. Những người hoặc tổ chức có thể được tiếp cận với thông tin
                cá nhân
              </h2>
              <p className='text-lg font-medium'>
                - Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội
                dung thông tin và tất cả các thiết kế, văn bản, đồ họa, phần
                mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm, mã
                nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Toàn bộ
                nội dung của trang web được bảo vệ bởi luật bản quyền của Việt
                Nam và các công ước quốc tế. Bản quyền đã được bảo lưu.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                4. Quyền pháp lý
              </h2>
              <p className='text-lg font-medium'>
                - Các điều kiện, điều khoản và nội dung của trang web này được
                điều chỉnh bởi luật pháp Việt Nam và Tòa án có thẩm quyền tại
                Việt Nam sẽ giải quyết bất kỳ tranh chấp nào phát sinh từ việc
                sử dụng trái phép trang web này.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                5. Quy định về bảo mật
              </h2>
              <p className='text-lg font-medium'>
                - Trang web của chúng tôi coi trọng việc bảo mật thông tin và sử
                dụng các biện pháp tốt nhất bảo vệ thông tin và việc thanh toán
                của quý khách. Thông tin của quý khách trong quá trình thanh
                toán sẽ được mã hóa để đảm bảo an toàn. Sau khi quý khách hoàn
                thành quá trình đặt hàng, quý khách sẽ thoát khỏi chế độ an
                toàn.
                <br />
                <br />
                - Quý khách không được sử dụng bất kỳ chương trình, công cụ hay
                hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi
                cấu trúc dữ liệu. Trang web cũng nghiêm cấm việc phát tán,
                truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá
                hoại hay xâm nhập vào dữ liệu của hệ thống. Cá nhân hay tổ chức
                vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước
                pháp luật nếu cần thiết.
                <br />
                <br />- Mọi thông tin giao dịch sẽ được bảo mật nhưng trong
                trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải
                cung cấp những thông tin này cho các cơ quan pháp luật.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                6. Thay đổi, hủy bỏ giao dịch tại website
              </h2>
              <p className='text-lg font-medium'>
                Trong mọi trường hợp, khách hàng đều có quyền chấm dứt giao dịch
                nếu đã thực hiện các biện pháp sau đây:
                <br />
                <br />- Trả lại hàng hoá đã nhận nhưng chưa sử dụng hoặc hưởng
                bất kỳ lợi ích nào từ hàng hóa đó (theo quy định của chính sách
                đổi trả hàng từ công ty).
              </p>
            </div>
          </>
        ) : (
          <>
            <p className='text-lg font-medium'>
              By accessing and using our website, you agree to these Terms and
              Conditions. The website reserves the right to change, modify, add,
              or remove any part of these Terms and Conditions at any time
              without prior notice. Changes take effect immediately upon being
              posted on the website. Your continued use of the website after
              such changes constitutes your acceptance of the updated Terms and
              Conditions.
              <br />
              <br />
              Please check this page regularly to stay informed of any updates.
            </p>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                1. Website Usage Guidelines
              </h2>
              <p className='text-lg font-medium'>
                - Users must be at least 18 years old or access the website
                under the supervision of a parent or legal guardian.
                <br />
                <br />
                - We grant you a limited license to access and shop on this
                website in accordance with the stated Terms and Conditions.
                <br />
                <br />
                - Any commercial use of this website or use on behalf of a third
                party without our prior written consent is strictly prohibited.
                Any violation will result in termination of the granted license
                without notice.
                <br />
                <br />
                - This website is for product information purposes only.
                Therefore, any reviews or comments displayed are personal
                opinions of customers and do not represent our views.
                <br />
                <br />
                - Users are required to register with accurate personal
                information and update it when changes occur. Each user is
                responsible for maintaining the confidentiality of their account
                and password, as well as all activities under their account. You
                must notify us immediately if unauthorized access occurs. We are
                not responsible for any loss or damage arising from your failure
                to comply with these requirements.
                <br />
                <br />- By registering, you agree to receive promotional emails
                from the website. You may opt out at any time by clicking the
                unsubscribe link at the bottom of each promotional email.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                2. Order Acceptance and Pricing
              </h2>
              <p className='text-lg font-medium'>
                - We reserve the right to refuse or cancel any order at any time
                for any reason. We may request additional information such as
                phone number or address before accepting an order.
                <br />
                <br />- We strive to provide accurate pricing information;
                however, errors may occasionally occur. In cases where a product
                is listed with an incorrect price, we reserve the right to
                contact you for clarification or cancel the order. We may refuse
                or cancel any order regardless of whether the order has been
                confirmed or payment has been processed.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                3. Trademarks and Copyright
              </h2>
              <p className='text-lg font-medium'>
                - All intellectual property rights (registered or unregistered),
                including content, designs, text, graphics, software, images,
                videos, music, audio, software translations, source code, and
                underlying software are the property of our company.
                <br />
                <br />- All website content is protected by Vietnamese copyright
                law and international conventions. All rights are reserved.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                4. Legal Jurisdiction
              </h2>
              <p className='text-lg font-medium'>
                - These Terms and Conditions and all website content are
                governed by the laws of Vietnam. Any disputes arising from
                unauthorized use of this website shall be resolved by competent
                courts in Vietnam.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                5. Security Policy
              </h2>
              <p className='text-lg font-medium'>
                - We place great importance on protecting customer information
                and payment security. Payment-related information is encrypted
                to ensure safety. After order completion, customers will exit
                secure mode.
                <br />
                <br />
                - Users are strictly prohibited from using any tools, programs,
                or methods to interfere with or alter the website’s system or
                data structure. Any acts of interference, disruption, or
                unauthorized access are strictly forbidden. Violators may have
                their rights revoked and may be prosecuted in accordance with
                the law.
                <br />
                <br />- All transaction information is kept confidential unless
                disclosure is required by law or requested by competent
                authorities.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                6. Transaction Modification or Cancellation
              </h2>
              <p className='text-lg font-medium'>
                In all cases, customers have the right to terminate transactions
                provided that the following conditions are met:
                <br />- Returned goods must be unused and no benefits must have
                been derived from the goods, in accordance with the company’s
                return and exchange policy.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TermsPage;
