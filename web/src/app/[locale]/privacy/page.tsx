import { type Metadata } from 'next';
import { Link } from '~/components/ui';
import NextLink from 'next/link';
import { getDictionary } from '~/lib/dictionary';
import { bannerService } from '~/services';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: dict.privacy.title,
    description: dict.privacy.description
  };
}

async function Page({ params }: Props) {
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
          {dict.privacy.title}
        </h1>
      </div>
      <div className='container space-y-6 my-16'>
        <h1 className='text-accent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
          {dict.privacy.title}
        </h1>
        {locale === 'vi' ? (
          <>
            <p className='text-lg font-medium'>
              Hiện nay, vấn đề bảo mật thông tin, mua bán thông tin cá nhân,
              thông tin mật đang là vấn đề khá nhạy cảm trong xã hội. Website:{' '}
              <Link
                href='/'
                className='text-blue-400 hover:underline hover:underline-offset-4'
              >
                anthaikhang.com
              </Link>{' '}
              chúng tôi luôn trân trọng những thông tin liên kết từ phía khách
              hàng và tuân thủ nghiêm ngặt nguyên tắc bảo mật xem như là mục
              tiêu sống còn của đơn vị chúng tôi.
              <br />
              <br />
              Chúng tôi nêu những điều kiện đảm bảo tuyệt đối dưới đây để quý
              khách hàng biết rõ và có thể chắc chắn rằng chúng tôi tôn trọng
              tất cả những quyền lợi riêng tư cũng như nguyên tắc bảo mật thông
              tin nhạy cảm cá nhân khi các thông tin của quý khách hàng cung cấp
              riêng cho Website{' '}
              <Link
                href='/'
                className='text-blue-400 hover:underline hover:underline-offset-4'
              >
                anthaikhang.com
              </Link>{' '}
              Trước khi truy cập đăng tải thông tin, quý khách hàng nên đọc qua
              những quy định bảo mật cần thiết để biết và tránh những điều mà
              quý khách hàng không mong muốn về sau.
            </p>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                1. Địa chỉ của đơn vị thu thập thông tin và quản lý thông tin
              </h2>
              <p className='text-lg font-medium'>
                – CÔNG TY CỔ PHẦN AN THÁI KHANG
                <br />
                – Địa chỉ: 91/18/5 Lê Văn Duyệt, phường Gia Định, Thành phố Hồ
                Chí Minh.
                <br />– Hotline: 076 464 4245
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                2. Mục đích và phạm vi thu thập thông tin
              </h2>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.1 Mục đích thu thập thông tin
                </h3>
                <p className='text-lg font-medium'>
                  Website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  thu thập thông tin khách hàng để:
                  <br />– Cung cấp sản phẩm theo nhu cầu của khách hàng
                  <br />– Liên hệ xác nhận khi khách hàng xác lập giao dịch trên
                  website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  <br />– Liên lạc và giải quyết với khách hàng trong những
                  trường hợp đặc biệt.
                  <br />– Thực hiện việc quản lý website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>
                  , gửi thông tin cập nhật về website, các chương trình khuyến
                  mại, ưu đãi/tri ân tới khách hàng
                  <br />– Ngăn ngừa các hoạt động phá hủy tài khoản người dùng
                  của khách hàng hoặc các hoạt động giả mạo
                  <br />– Quản lý, phân tích, đánh giá số liệu để xây dựng chính
                  sách bán và chính sách phục vụ Khách hàng phù hợp
                  <br />– Tiếp nhận thông tin, góp ý, đề xuất, khiếu nại của
                  Khách hàng nhằm cải thiện chất lượng dịch vụ của{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  <br />– Không sử dụng thông tin cá nhân của thành viên ngoài
                  mục đích xác nhận và liên hệ có liên quan đến giao dịch tại{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>
                  <br />– Trong trường hợp có yêu cầu của pháp luật:{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  có trách nhiệm hợp tác cung cấp thông tin cá nhân thành viên
                  khi có yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa
                  án, cơ quan công an điều tra liên quan đến hành vi vi phạm
                  pháp luật nào đó của khách hàng. Ngoài ra, không ai có quyền
                  xâm phạm vào thông tin cá nhân của thành viên.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.2. Phạm vi thu thập thông tin
                </h3>
                <p className='text-lg font-medium'>
                  Việc thu thập thông tin cá nhân được thực hiện trên cơ sở
                  khách hàng tự khai báo để đăng ký mua hàng trực tuyến tại
                  website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>
                  . Tùy từng thời điểm, thông tin thu thập sẽ bao gồm nhưng
                  không giới hạn ở:
                  <br />– Tên đầy đủ
                  <br />– Địa chỉ
                  <br />– Điện thoại
                  <br />– Thư điện tử
                  <br />– Nội dung cần liên hệ (nếu có)
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.3. Phạm vi sử dụng thông tin
                </h3>
                <p className='text-lg font-medium'>
                  Thông tin chúng tôi thu thập được sử dụng trong phạm vi sau:
                  <br />+ Bàn giao sản phẩm cho khách hàng đã mua hàng tại
                  website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    https://www.anthaikhang.com/
                  </Link>{' '}
                  <br />+ Thông báo bàn giao sản phẩm và hỗ trợ cho khách hàng
                  trong quá trình sử dụng sản phẩm;
                  <br />+ Xử lý đơn hàng và cung cấp sản phẩm qua website:{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    https://www.anthaikhang.com/
                  </Link>{' '}
                  <br />
                  Ngoài ra, các thông tin giao dịch bao gồm: lịch sử mua hàng,
                  giá trị giao dịch và phương thức thanh toán cũng được website:
                  anthaikhang.com lưu trữ để giải quyết các vấn đề có thể phát
                  sinh sau này.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.4  Thời gian lưu trữ thông tin
                </h3>
                <p className='text-lg font-medium'>
                  Chúng tôi sẽ lưu trữ các thông tin cá nhân do khách hàng cung
                  cấp trên các hệ thống nội bộ của chúng tôi trong quá trình
                  cung cấp sản phẩm cho khách hàng, cho đến khi hoàn thành mục
                  đích thu thập, hoặc khi khách hàng có yêu cầu hủy các thông
                  tin đã cung cấp.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.5 Cam kết bảo mật thông tin cá nhân khách hàng:sử dụng thông
                  tin
                </h3>
                <p className='text-lg font-medium'>
                  Website:{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  cam kết bảo đảm an toàn thông tin cho quý khách hàng khi đăng
                  ký thông tin cá nhân với chúng tôi. Chúng tôi cam kết không
                  trao đổi mua bán thông tin khách hàng vì mục đích thương mại.
                  Mọi sự chia sẻ và sử dụng thông tin khách hàng chúng tôi cam
                  kết thực hiện theo chính sách bảo mật của chúng tôi. Chúng tôi
                  cam kết sẽ khiến quý khách cảm thấy tin tưởng và hài lòng về
                  việc bảo mật thông tin cá nhân khi tham gia và sử dụng website
                  của{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  <br />
                  Website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  chỉ chia sẻ thông tin cá nhân của bạn với bên thứ ba trong các
                  trường hợp sau:
                  <br />+ Khi có sự đồng ý của bạn.
                  <br />+ Khi việc chia sẻ thông tin là cần thiết để cung cấp
                  dịch vụ hoặc xử lý đơn hàng của bạn (ví dụ: chia sẻ với đơn vị
                  vận chuyển,…..).
                  <br />+ Khi chúng tôi có nghĩa vụ phải cung cấp thông tin theo
                  yêu cầu của cơ quan pháp luật hoặc theo quy định của pháp
                  luật.
                </p>
              </div>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                3. Những người hoặc tổ chức có thể được tiếp cận với thông tin
                cá nhân
              </h2>
              <p className='text-lg font-medium'>
                Hoạt động kinh doanh của{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                không bao gồm việc bán các thông tin của Khách hàng cho bên thứ
                ba. Website{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                chỉ cung cấp thông tin Khách hàng cho các bên được liệt kê dưới
                đây nhằm đảm bảo quyền lợi của Khách hàng theo những cam kết bảo
                mật của{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>
                <br />+ Cơ quan nhà nước khi có yêu cầu:{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                sẽ cung cấp thông tin của Khách hàng để phục vụ quá trình điều
                tra của các cơ quan đó.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                4. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ
                liệu cá nhân của mình.
              </h2>
              <p className='text-lg font-medium'>
                Khách hàng có thể thực hiện quyền chỉnh sửa, cập nhật thông tin
                cá nhân của mình bằng cách Liên hệ với chúng tôi qua email:{' '}
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  support@anthaikhang.com
                </NextLink>{' '}
                hoặc số điện thoại{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                5. Quyền lợi của khách hàng
              </h2>
              <p className='text-lg font-medium'>
                Khách hàng có quyền:
                <br />+ Yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân
                của mình.
                <br />+ Từ chối nhận các thông tin quảng cáo, khuyến mãi từ{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>
                <br />+ Đưa ra khiếu nại nếu có vi phạm về bảo mật thông tin cá
                nhân.
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                6. Thay đổi điều khoản bảo mật
              </h2>
              <p className='text-lg font-medium'>
                Website{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                có thể cập nhật điều khoản bảo mật thông tin khách hàng khi cần
                thiết. Mọi thay đổi sẽ được thông báo trên website của chúng
                tôi. Khách hàng nên thường xuyên kiểm tra để nắm rõ các thay đổi
                (nếu có).
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                7. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ
                liệu cá nhân của mình
              </h2>
              <p className='text-lg font-medium'>
                Khách hàng có thể thực hiện quyền chỉnh sửa, cập nhật thông tin
                cá nhân của mình bằng cách liên hệ với chúng tôi qua số điện
                thoại, email hoặc địa chỉ liên lạc được công bố trên website:{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                8. Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng
                liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích
                hoặc phạm vi đã thông báo
              </h2>
              <p className='text-lg font-medium'>
                Khi người tiêu dùng phát hiện thông tin cá nhân của mình trên{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  https://www.anthaikhang.com/
                </Link>{' '}
                bị sử dụng sai mục đích hoặc ngoài phạm vi sử dụng thông tin,
                người tiêu dùng có thể gửi khiếu nại tới{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  https://www.anthaikhang.com/
                </Link>{' '}
                theo các cách sau:
                <br />– Liên hệ số điện thoại:{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
                <br />– Gửi đơn khiếu nại về địa chỉ: 91/18/5 Lê Văn Duyệt,
                phường Gia Định, Thành phố Hồ Chí Minh.
                <br />
                Website anthaikhang.com xử lý phản ánh liên quan đến thông tin
                cá nhân khách hàng là 03 (ba) ngày làm việc, kể từ ngày tiếp
                nhận được khiếu nại của khách hàng.
                <br />
                Trong mọi trường hợp,{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                đề cao biện pháp thương lượng, hòa giải với khách hàng để thống
                nhất và đưa ra biện pháp giải quyết, xử lý khiếu nại.
                <br />
                Trong trường hợp hai bên không đạt được sự thỏa thuận như mong
                muốn dẫn đến thương lượng, hòa giải không thành, một trong hai
                bên có quyền đưa vụ việc ra tòa án nhân dân có thẩm quyền để
                giải quyết theo quy định của pháp luật.
                <br />
                anthaikhang.com hiểu rằng quyền lợi của bạn trong việc bảo vệ
                thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên
                trong bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến
                chính sách bảo mật của website keosonvn.com và liên quan đến
                việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã
                thông báo, vui lòng liên hệ với chúng tôi qua email:{' '}
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  support@anthaikhang.com
                </NextLink>{' '}
                hoặc hotline{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
              </p>
            </div>
          </>
        ) : (
          <>
            <p className='text-lg font-medium'>
              Currently, information security, personal data protection, and
              confidential information are sensitive issues in society. At{' '}
              <Link
                href='/'
                className='text-blue-400 hover:underline hover:underline-offset-4'
              >
                anthaikhang.com
              </Link>
              , we highly value the information provided by our customers and
              strictly comply with privacy protection principles, considering
              this a vital objective of our company.
              <br />
              <br />
              We outline the following commitments to ensure absolute security,
              so customers can clearly understand and be confident that we
              respect all privacy rights and strictly protect sensitive personal
              information provided to{' '}
              <Link
                href='/'
                className='text-blue-400 hover:underline hover:underline-offset-4'
              >
                anthaikhang.com
              </Link>
              . Before accessing or submitting information, customers should
              carefully read this Privacy Policy to understand and avoid any
              undesired issues in the future.
            </p>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                1. Information Collection and Management Entity
              </h2>
              <p className='text-lg font-medium'>
                – AN THAI KHANG JOINT STOCK COMPANY
                <br />
                – Address: 91/18/5 Le Van Duyet Street, Gia Dinh Ward, Ho Chi
                Minh City, Vietnam.
                <br />– Hotline: 076 464 4245
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                2. Purpose and Scope of Information Collection
              </h2>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.1 Purpose of Information Collection
                </h3>
                <p className='text-lg font-medium'>
                  The website{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  collects customer information for the following purposes:
                  <br />– To provide products according to customer needs
                  <br />– To contact and confirm transactions conducted on{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  <br />– To communicate with and support customers in special
                  cases
                  <br />– To manage and operate the website, send updates,
                  promotions, offers, and customer appreciation programs
                  <br />– To prevent activities that may damage user accounts or
                  involve fraud or impersonation
                  <br />– To manage, analyze, and evaluate data in order to
                  develop appropriate sales and customer service policies
                  <br />– To receive feedback, suggestions, and complaints from
                  customers to improve service quality
                  <br />– Customer personal information is not used for any
                  purpose other than transaction confirmation and communication
                  related to services on{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>
                  <br />– In cases required by law, anthaikhang.com is
                  responsible for providing customer personal information to
                  competent authorities such as courts, procuracies, or police
                  agencies related to legal investigations. Except for these
                  cases, no organization or individual has the right to access
                  or infringe upon customer personal information.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.2. Scope of Information Collection
                </h3>
                <p className='text-lg font-medium'>
                  Personal information is collected based on customer
                  self-declaration when registering for online purchases on{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>
                  . Depending on each period, collected information may include
                  but is not limited to:
                  <br />– Full name
                  <br />– Address
                  <br />– Phone number
                  <br />– Email address
                  <br />– Contact content (if any)
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.3. Scope of Information Use
                </h3>
                <p className='text-lg font-medium'>
                  The collected information is used for the following purposes:
                  <br />+ Delivering products to customers who purchase via{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    https://www.anthaikhang.com/
                  </Link>{' '}
                  <br />+ Notifying customers about delivery and providing
                  support during product usage
                  <br />+ Processing orders and supplying products through:{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    https://www.anthaikhang.com/
                  </Link>{' '}
                  <br />
                  In addition, transaction information such as purchase history,
                  transaction value, and payment methods are stored to resolve
                  any issues that may arise in the future.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.4 Information Storage Duration
                </h3>
                <p className='text-lg font-medium'>
                  We store customers’ personal information on our internal
                  systems during the product supply process until the purpose of
                  information collection is completed, or until the customer
                  requests the deletion of their provided information.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-secondary-2'>
                  2.5 Commitment to Protect Customer Personal Information
                </h3>
                <p className='text-lg font-medium'>
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  commits to ensuring the safety and confidentiality of customer
                  personal information. We guarantee not to trade, sell, or
                  exchange customer information for commercial purposes. Any
                  sharing or use of customer information is conducted strictly
                  in accordance with this Privacy Policy.
                  <br />
                  <br /> We strive to ensure customers feel secure and satisfied
                  when providing personal information and using services on{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>
                  .
                  <br />
                  <br />{' '}
                  <Link
                    href='/'
                    className='text-blue-400 hover:underline hover:underline-offset-4'
                  >
                    anthaikhang.com
                  </Link>{' '}
                  only shares personal information with third parties in the
                  following cases:
                </p>
              </div>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                3. Organizations and Individuals Authorized to Access Personal
                Information
              </h2>
              <p className='text-lg font-medium'>
                The business activities of{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                do not include selling customer information to third parties.
                Customer information is only provided to the following entities
                to ensure customer rights in accordance with our privacy
                commitments:
                <br />- Government authorities upon lawful request for
                investigation or legal procedures
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                4. Means for Customers to Access and Modify Personal Information
              </h2>
              <p className='text-lg font-medium'>
                Customers may access, edit, or update their personal information
                by contacting us via:
                <br />- Email:{' '}
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  support@anthaikhang.com
                </NextLink>
                <br />- Hotline:{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                5. Customer Rights
              </h2>
              <p className='text-lg font-medium'>
                Customers have the right to:
                <br />+ Request access, correction, or deletion of their
                personal information
                <br />+ Refuse to receive promotional or marketing
                communications from{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>
                <br />+ File complaints if there is any violation regarding
                personal data protection
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                6. Changes to the Privacy Policy
              </h2>
              <p className='text-lg font-medium'>
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                reserves the right to update this Privacy Policy when necessary.
                Any changes will be announced on our website. Customers are
                encouraged to review this policy regularly to stay informed of
                updates (if any).
              </p>
            </div>
            <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                7. Complaint Handling Mechanism Regarding Personal Information
                Misuse
              </h2>
              <p className='text-lg font-medium'>
                If customers discover that their personal information on{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  https://www.anthaikhang.com/
                </Link>{' '}
                is used improperly or beyond the announced scope, they may
                submit a complaint through:
                <br />
                - Hotline: 076 464 4245
                <br />
                - Mailing Address: 91/18/5 Le Van Duyet Street, Gia Dinh Ward,
                Ho Chi Minh City, Vietnam
                <br />{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                will process complaints related to personal information within{' '}
                <strong>three (03) working days</strong> from the date of
                receipt.
                <br />
                In all cases, we prioritize negotiation and mediation to reach a
                mutual resolution. If mediation fails, either party has the
                right to bring the matter before a competent court in accordance
                with applicable laws.
                <br />
                anthaikhang.com understands that protecting customer personal
                information is our responsibility. For any questions, feedback,
                or complaints related to this Privacy Policy or the misuse of
                personal information, please contact us via{' '}
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  support@anthaikhang.com
                </NextLink>{' '}
                or Hotline:{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
              </p>
            </div>
            {/* <div className='space-y-6'>
              <h2 className='text-[2.125rem] text-secondary-2 font-semibold border-l-4 border-[#00ADFE] pl-3'>
                8. Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng
                liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích
                hoặc phạm vi đã thông báo
              </h2>
              <p className='text-lg font-medium'>
                Khi người tiêu dùng phát hiện thông tin cá nhân của mình trên{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  https://www.anthaikhang.com/
                </Link>{' '}
                bị sử dụng sai mục đích hoặc ngoài phạm vi sử dụng thông tin,
                người tiêu dùng có thể gửi khiếu nại tới{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  https://www.anthaikhang.com/
                </Link>{' '}
                theo các cách sau:
                <br />– Liên hệ số điện thoại:{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
                <br />– Gửi đơn khiếu nại về địa chỉ: 91/18/5 Lê Văn Duyệt,
                phường Gia Định, Thành phố Hồ Chí Minh.
                <br />
                Website anthaikhang.com xử lý phản ánh liên quan đến thông tin
                cá nhân khách hàng là 03 (ba) ngày làm việc, kể từ ngày tiếp
                nhận được khiếu nại của khách hàng.
                <br />
                Trong mọi trường hợp,{' '}
                <Link
                  href='/'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  anthaikhang.com
                </Link>{' '}
                đề cao biện pháp thương lượng, hòa giải với khách hàng để thống
                nhất và đưa ra biện pháp giải quyết, xử lý khiếu nại.
                <br />
                Trong trường hợp hai bên không đạt được sự thỏa thuận như mong
                muốn dẫn đến thương lượng, hòa giải không thành, một trong hai
                bên có quyền đưa vụ việc ra tòa án nhân dân có thẩm quyền để
                giải quyết theo quy định của pháp luật.
                <br />
                anthaikhang.com hiểu rằng quyền lợi của bạn trong việc bảo vệ
                thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên
                trong bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến
                chính sách bảo mật của website keosonvn.com và liên quan đến
                việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã
                thông báo, vui lòng liên hệ với chúng tôi qua email:{' '}
                <NextLink
                  href='mailto:support@anthaikhang.com'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  support@anthaikhang.com
                </NextLink>{' '}
                hoặc hotline{' '}
                <NextLink
                  href='tel:0764644245'
                  className='text-blue-400 hover:underline hover:underline-offset-4'
                >
                  076 464 4245
                </NextLink>
                .
              </p>
            </div> */}
          </>
        )}
      </div>
    </>
  );
}

export default Page;
