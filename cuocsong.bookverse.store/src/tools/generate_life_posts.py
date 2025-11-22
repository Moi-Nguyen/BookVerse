# -*- coding: utf-8 -*-
from __future__ import annotations

import html
import json
from pathlib import Path

POSTS = [
    {
        "slug": "song-cham-de-hieu-minh",
        "title": "Sống chậm để hiểu mình",
        "tag": "Triết lý sống",
        "category": "Triết lý sống",
        "description": "Ba nhịp thở sâu và một trang nhật ký giúp bạn trở lại với cơ thể trước khi phản ứng vô thức.",
        "author": "Soul Notes",
        "date": "12 Mar 2024",
        "readingTime": "8 phút",
        "heroImage": "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người trẻ ngồi thiền cạnh cửa sổ sáng sớm",
        "secondaryImage": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Nhật ký cá nhân và tách trà nóng",
        "intro": [
            "Trong nhịp sống số hóa, cơ thể luôn gửi tín hiệu yêu cầu chậm lại nhưng chúng ta thường bỏ qua. Những cơn đau vai gáy, hơi thở gấp gáp hay việc phản ứng quá nhanh với tin nhắn đều là lời nhắc rằng tâm trí đã đi trước thân thể.",
            "Sống chậm không đồng nghĩa với trì trệ; đó là nghệ thuật chủ động thiết lập nhịp sống phù hợp với nhịp tim. Khi biết chăm sóc từng phút nhỏ, bạn sẽ ngạc nhiên nhận ra mình vẫn hoàn thành công việc nhưng cùng lúc hiểu rõ cảm xúc.",
            "Bản đồ thực hành dưới đây kết hợp hơi thở, viết tay và những khoảng trắng trong lịch để bạn luyện sự hiện diện mỗi ngày."
        ],
        "sections": [
            {
                "heading": "Nhận diện tín hiệu cơ thể",
                "paragraphs": [
                    "Hãy bắt đầu bằng việc đặt báo thức nhẹ nhàng ba lần trong ngày để dừng lại và quan sát cơ thể trong một phút. Ghi lại xem lúc đó vai đang gồng, bụng căng hay đầu óc rối bời; việc đặt tên cảm giác sẽ kéo bạn trở về hiện tại.",
                    "Sau một tuần, đối chiếu các ghi chú để thấy khung giờ nào cơ thể thường xuyên mệt mỏi. Từ đó, bạn có thể sắp xếp công việc đòi hỏi sự tập trung vào quãng thời gian năng lượng cao thay vì ép mình chạy suốt ngày dài."
                ]
            },
            {
                "heading": "Đối thoại với chính mình",
                "paragraphs": [
                    "Mỗi tối, viết tự do một trang trả lời câu hỏi: “Hôm nay, điều gì khiến mình xúc động nhất?”. Đừng chỉnh sửa hay phán xét; trang giấy là nơi phiên bản thật thà được lắng nghe mà không bị dán nhãn đúng sai.",
                    "Khi đã quen, bạn có thể kết thúc bằng một câu cảm ơn dành cho cơ thể vì đã đồng hành đến cuối ngày. Sự tử tế nhỏ này giúp não bộ ghi nhận rằng bạn luôn có một nơi an toàn để quay về."
                ]
            },
            {
                "heading": "Đặt khoảng trắng vào lịch",
                "paragraphs": [
                    "Khoảng trắng trong lịch chính là không gian cho hơi thở. Chọn ít nhất hai khoảng 15 phút trong ngày chỉ dành cho việc pha trà, nhìn trời hoặc nghe bản nhạc yêu thích. Đừng coi đó là phần thưởng lúc rảnh rỗi mà hãy xem như cuộc hẹn với chính bạn.",
                    "Khi khoảng trắng được ưu tiên ngang hàng với cuộc họp, bạn sẽ ít bị cuốn theo phản ứng vô thức. Từ đây, mọi quyết định đều xuất phát từ sự rõ ràng thay vì sự vội vàng."
                ]
            }
        ],
        "quote": "Khi ta chậm lại để lắng nghe, thời gian không mất đi mà trở thành đồng minh nuôi dưỡng sự sáng suốt.",
        "quote_after_section": 0,
        "practices": [
            "Thực hiện ba vòng thở 4-6-4 trước khi trả lời tin nhắn quan trọng.",
            "Dành ít nhất một buổi tối trong tuần không lịch hẹn để ở một mình.",
            "Treo một tờ giấy nhỏ cạnh bàn làm việc với câu hỏi “Cơ thể mình đang cần gì?”."
        ],
        "closing": [
            "Sống chậm là kỹ năng cần luyện tập. Bạn sẽ đôi lần quên mất chuông nhắc thở hoặc bỏ lỡ trang nhật ký, nhưng chỉ cần quay lại vào ngày hôm sau, hành trình hiểu mình vẫn tiếp tục.",
            "Hãy chia sẻ trải nghiệm với những người cũng muốn sống tỉnh thức. Cộng đồng sẽ giúp bạn giữ cam kết với chính mình và lan tỏa năng lượng bình an."
        ]
    },
    {
        "slug": "lang-nghe-tieng-noi-ben-trong",
        "title": "Lắng nghe tiếng nói bên trong",
        "tag": "Chánh niệm",
        "category": "Chánh niệm",
        "description": "Thực hành ghi âm, viết tay và đặt câu hỏi mở để đọc vị cảm xúc nguyên bản.",
        "author": "Minh Tịnh",
        "date": "11 Mar 2024",
        "readingTime": "8 phút",
        "heroImage": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Cô gái viết nhật ký trong phòng sáng đèn",
        "secondaryImage": "https://images.unsplash.com/photo-1500534315683-5e36c52794b9?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Cuốn sổ tay và bút máy đặt trên bàn gỗ",
        "intro": [
            "Tiếng nói bên trong thường bị lấn át bởi thông báo liên tục và kỳ vọng của người khác. Ta dễ dàng đưa ra quyết định dựa trên phản ứng của mọi người hơn là cảm nhận thực sự của bản thân.",
            "Để sống trung thực với mình, ta cần một hành lang yên tĩnh dành riêng cho cảm xúc. Hành lang đó được xây nên từ những thói quen nhỏ: đặt câu hỏi dịu dàng, ghi âm suy nghĩ, rồi viết tay để nhìn rõ điều trái tim muốn nói.",
            "Bạn không cần một kỳ nghỉ dài ngày để lắng nghe bản thân; chỉ cần một góc nhỏ và vài phút mỗi sáng tối."
        ],
        "sections": [
            {
                "heading": "Tạo nghi thức quét cơ thể",
                "paragraphs": [
                    "Trước khi phản hồi email khó, hãy đặt tay lên ngực và hỏi nhỏ: “Cơ thể mình đang cảm thấy thế nào?”. Câu hỏi đơn giản giúp ta tách khỏi cơn cảm xúc đang dâng lên.",
                    "Ghi chú nhanh bằng ba từ khóa về cảm giác, ví dụ: nặng, nóng, run. Dần dần, bạn sẽ nhận ra tiếng nói bên trong luôn cố nhắc bạn chăm sóc những vùng cơ thể nhất định."
                ]
            },
            {
                "heading": "Ghi âm suy nghĩ thầm thì",
                "paragraphs": [
                    "Dùng điện thoại ghi âm ba phút độc thoại mỗi khi tâm trí quá tải. Việc nói ra thành lời giúp những suy nghĩ trôi nổi có hình dạng cụ thể.",
                    "Buổi tối, nghe lại đoạn ghi âm với thái độ tò mò thay vì phán xét. Bạn sẽ phát hiện ra những chủ đề lặp đi lặp lại – chính là thông điệp mà nội tâm đang gắng gửi đến bạn."
                ]
            },
            {
                "heading": "Viết câu hỏi mở cho trái tim",
                "paragraphs": [
                    "Kết thúc ngày bằng việc viết hai câu hỏi: “Hôm nay mình thật sự khao khát điều gì?” và “Điều gì khiến mình sợ hãi?”. Nếu câu trả lời chưa xuất hiện, cứ để trang giấy trống và quay lại ngày hôm sau.",
                    "Sự kiên nhẫn với chính mình là chiếc chìa khóa mở cánh cửa nội tâm. Khi trái tim nhận thấy bạn sẵn sàng lắng nghe, nó sẽ cất tiếng nói rõ ràng hơn."
                ]
            }
        ],
        "quote": "Tiếng nói bên trong không bao giờ biến mất; nó chỉ khẽ thì thầm hơn mỗi khi ta bận rộn.",
        "quote_after_section": 1,
        "practices": [
            "Đặt lịch 10 phút vào buổi sáng chỉ để viết tự do không mục tiêu.",
            "Giữ một thư mục audio “Nhật ký tiếng nói bên trong” và nghe lại mỗi tuần.",
            "Khi khó quyết định, hãy hỏi: “Quyết định này có khiến mình cảm thấy rộng mở hay co rút?”"
        ],
        "closing": [
            "Lắng nghe bản thân là quá trình xây dựng niềm tin. Càng trung thực khi ghi lại cảm xúc, bạn càng bớt phụ thuộc vào tiếng ồn bên ngoài.",
            "Hãy kiên trì với những câu hỏi mở; sự rõ ràng sẽ đến khi bạn đủ kiên nhẫn chờ đợi câu trả lời."
        ]
    },
    {
        "slug": "toi-gian-cam-xuc-hon-loan",
        "title": "Tối giản cảm xúc hỗn loạn",
        "tag": "Tối giản",
        "category": "Tối giản",
        "description": "Ba bước gọi tên, sắp xếp và buông bớt cảm xúc nặng nề để tâm trí thông thoáng.",
        "author": "Lan Chi",
        "date": "10 Mar 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Góc phòng tối giản với ánh sáng tự nhiên",
        "secondaryImage": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Giá sách gọn gàng và cây xanh",
        "intro": [
            "Cảm xúc hỗn loạn giống như căn nhà chất đầy đồ cũ: khó tìm thấy thứ thật sự cần thiết và khiến ta ngột ngạt. Khi cảm giác tiêu cực ùn lại, ta dễ phản ứng thái quá hoặc tê liệt.",
            "Tối giản cảm xúc không phải bóp nghẹt cảm giác mà là phân loại chúng, giữ lại điều thiết yếu và buông bớt phần đã lỗi thời.",
            "Bằng cách gọi tên, viết ra và thiết kế nghi thức buông bỏ, bạn sẽ có tâm trí thông thoáng để sáng tạo và yêu thương."
        ],
        "sections": [
            {
                "heading": "Ghi chép kho cảm xúc",
                "paragraphs": [
                    "Cuối mỗi ngày, viết ra ba sự kiện khiến bạn rung động mạnh nhất và mô tả cảm giác đi kèm. Việc nhìn thấy chúng trên giấy giúp bạn hiểu điều gì đang chiếm dụng năng lượng.",
                    "Đánh dấu xem cảm xúc thuộc hiện tại hay là ký ức cũ vừa bị chạm vào. Khi nhận diện được nguồn gốc, bạn sẽ chọn phản ứng phù hợp hơn."
                ]
            },
            {
                "heading": "Đổi tên cảm xúc cho chính xác",
                "paragraphs": [
                    "Thay vì chỉ ghi “mệt”, hãy phân biệt đó là buồn bã, thất vọng hay lo âu. Mỗi cảm xúc cần một chiến lược chăm sóc khác nhau.",
                    "Bạn có thể sử dụng vòng tròn cảm xúc hoặc bảng từ khóa để luyện tập vốn từ. Càng gọi tên cụ thể, cảm xúc càng ít lẫn lộn."
                ]
            },
            {
                "heading": "Thiết kế nghi thức buông bớt",
                "paragraphs": [
                    "Sau khi viết xong, gấp tờ giấy lại và đặt vào “hộp cảm xúc”. Mỗi cuối tuần, hãy đọc lại và quyết định giữ hay thả.",
                    "Hành động vật lý giúp não bộ hiểu rằng bạn đã cho phép mình đặt gánh nặng xuống. Những cảm xúc cần chăm sóc thêm có thể chuyển thành kế hoạch trị liệu hoặc cuộc trò chuyện với người tin cậy."
                ]
            }
        ],
        "quote": "Tối giản cảm xúc là nghệ thuật ở lại với điều chân thật và buông tay khỏi phần giả định.",
        "quote_after_section": 2,
        "practices": [
            "Dùng sticker màu để đánh dấu cảm xúc mạnh trên lịch tuần.",
            "Lập nhóm bạn tin tưởng chia sẻ “bản tin cảm xúc” mỗi tối Chủ nhật.",
            "Tạo danh sách hành động cụ thể tương ứng với từng nhóm cảm xúc (ngủ đủ, gọi điện, vận động)."
        ],
        "closing": [
            "Tâm trí gọn gàng tạo ra không gian cho sự sáng tạo và lòng trắc ẩn. Bạn sẽ bất ngờ vì năng lượng quay trở lại nhanh thế nào khi cảm xúc được sắp xếp.",
            "Hãy nhớ rằng mỗi lần ghi chép là một lần bạn chọn đối xử tử tế với chính mình."
        ]
    },
    {
        "slug": "thuc-hanh-biet-on-buoi-sang",
        "title": "Thực hành biết ơn buổi sáng",
        "tag": "Biết ơn",
        "category": "Biết ơn",
        "description": "Nghi thức 10 phút kết hợp viết tay, chuyển động nhẹ và lời cảm ơn gửi đi.",
        "author": "An Nhiên",
        "date": "09 Mar 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Bữa sáng đơn giản với ánh nắng sớm",
        "secondaryImage": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Cuốn sổ và bình hoa nhỏ trên bàn",
        "intro": [
            "Buổi sáng là khoảnh khắc dễ bị chiếm bởi danh sách việc phải làm. Nhưng chỉ cần 10 phút biết ơn, não bộ sẽ được lập trình để chú ý vào điều tích cực suốt cả ngày.",
            "Thực hành biết ơn không phải để phủ nhận khó khăn mà để nhắc ta rằng bên cạnh thử thách luôn có những nguồn lực lặng thầm nâng đỡ.",
            "Nghi thức dưới đây kết nối giữa viết tay, chuyển động và chia sẻ để tạo vòng tròn biết ơn bền vững."
        ],
        "sections": [
            {
                "heading": "Viết bảng 3x3 biết ơn",
                "paragraphs": [
                    "Chia trang giấy thành ba cột: với bản thân, với người khác và với môi trường. Mỗi cột viết ra ba điều cụ thể khiến bạn thấy biết ơn.",
                    "Sự cụ thể – như mùi cà phê, ánh nắng chạm vào tay hay lời chào của bảo vệ – giúp cảm xúc biết ơn sống động và chân thật."
                ]
            },
            {
                "heading": "Kết hợp chuyển động nhẹ",
                "paragraphs": [
                    "Sau khi viết xong, hãy xoay khớp cổ tay, vươn vai và hít căng lồng ngực. Khi cơ thể cùng tham gia, thông điệp biết ơn sẽ lan tỏa toàn thân.",
                    "Bạn có thể bật một bài nhạc vui và cho phép mình mỉm cười. Năng lượng tích cực sẽ ở lại lâu hơn bạn nghĩ."
                ]
            },
            {
                "heading": "Lan tỏa lời cảm ơn",
                "paragraphs": [
                    "Chụp lại một dòng biết ơn và gửi cho người bạn nhắc đến, hoặc viết email ngắn cảm ơn đồng nghiệp. Việc chia sẻ giúp cảm xúc được nhân đôi.",
                    "Thỉnh thoảng, gửi lời cảm ơn đến chính mình bằng cách tự thưởng một bữa sáng lành mạnh hoặc một bó hoa nhỏ."
                ]
            }
        ],
        "quote": "Biết ơn không làm khó khăn biến mất, nhưng giúp ta nhìn thấy nguồn lực để đi qua khó khăn.",
        "quote_after_section": 1,
        "practices": [
            "Đặt cuốn sổ biết ơn cạnh ấm nước để dễ nhớ mỗi sáng.",
            "Gắn sticky note lên gương với câu hỏi: “Hôm nay mình biết ơn điều gì?”.",
            "Tạo nhóm chat gia đình và chia sẻ ba điều biết ơn mỗi cuối tuần."
        ],
        "closing": [
            "Sau vài tuần, bạn sẽ nhận thấy bộ não tự động tìm kiếm điều đáng yêu trong mọi tình huống.",
            "Hãy kiên trì ngay cả khi bận rộn; biết ơn là cơ bắp cần được luyện mỗi ngày."
        ]
    },
    {
        "slug": "nghe-thuat-nghi-ngoi-co-chu-dich",
        "title": "Nghệ thuật nghỉ ngơi có chủ đích",
        "tag": "Tự chăm sóc",
        "category": "Tự chăm sóc",
        "description": "Thiết kế menu nghỉ ngơi, phân loại mức năng lượng và bảo vệ thời gian phục hồi.",
        "author": "Thảo Vi",
        "date": "08 Mar 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người nằm thư giãn bên cửa sổ nắng",
        "secondaryImage": "https://images.unsplash.com/photo-1499744937866-d7e566a20faa?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Gối và chăn len mềm mại",
        "intro": [
            "Nghỉ ngơi không phải phần thưởng sau khi kiệt sức mà là chiến lược để giữ nhịp sống bền vững. Khi lịch trình toàn những cuộc hẹn, cơ thể không có khoảng để hồi phục và tâm trí dễ bốc hỏa.",
            "Nghệ thuật nghỉ ngơi có chủ đích giúp bạn phân loại mức năng lượng, chọn hình thức phù hợp rồi bảo vệ khoảng thời gian đó như một cuộc hẹn quan trọng.",
            "Khi bạn sống bằng năng lượng đã được sạc đầy, sự tử tế và sáng tạo sẽ tự nhiên trở lại."
        ],
        "sections": [
            {
                "heading": "Đọc khí hậu năng lượng",
                "paragraphs": [
                    "Mỗi sáng, đánh giá mức năng lượng của mình trên thang từ 1 đến 10. Viết ghi chú ngắn về lý do (mất ngủ, ăn tối muộn, nhận tin vui...).",
                    "Sau vài tuần, bạn sẽ thấy quy luật riêng và biết lúc nào cần nghỉ sâu, lúc nào chỉ cần vận động nhẹ."
                ]
            },
            {
                "heading": "Tạo menu nghỉ ngơi",
                "paragraphs": [
                    "Liệt kê hoạt động giúp bạn phục hồi và phân nhóm: yên tĩnh (đọc sách, thiền), sáng tạo (vẽ, làm gốm), kết nối (trà chiều với người thân).",
                    "Khi cảm thấy mệt, nhìn vào menu để chọn phương án thay vì mặc định lướt mạng xã hội."
                ]
            },
            {
                "heading": "Bảo vệ lịch nghỉ",
                "paragraphs": [
                    "Đặt lịch nghỉ trên calendar như một cuộc họp không thể hủy. Thông báo với đồng nghiệp rằng đó là khoảng thời gian hồi phục để họ tôn trọng ranh giới của bạn.",
                    "Thói quen này truyền cảm hứng để mọi người trong đội cũng coi trọng sự nghỉ ngơi có chủ đích."
                ]
            }
        ],
        "quote": "Nghỉ ngơi không phải sự lười biếng mà là cách chúng ta trao lại năng lượng cho cơ thể và giấc mơ.",
        "quote_after_section": 2,
        "practices": [
            "Đặt lời nhắc trên đồng hồ: “Đã đến giờ cho cơ thể nghỉ?”.",
            "Chuẩn bị sẵn giỏ đồ nghỉ: tinh dầu, sách yêu thích, tai nghe.",
            "Mỗi cuối tuần, đánh giá xem bạn đã dành bao nhiêu giờ cho việc phục hồi đúng nghĩa."
        ],
        "closing": [
            "Một kế hoạch nghỉ ngơi rõ ràng giúp bạn chủ động nạp lại năng lượng trước khi cạn kiệt.",
            "Khi bạn đối xử tử tế với nhịp sinh học của mình, công việc và các mối quan hệ cũng trở nên nhẹ nhàng hơn."
        ]
    },
    {
        "slug": "doi-thoai-diu-dang-voi-noi-so",
        "title": "Đối thoại dịu dàng với nỗi sợ",
        "tag": "Tâm lý",
        "category": "Tâm lý",
        "description": "Áp dụng sơ đồ cảm xúc, thư trấn an và nghi thức kết thúc để nỗi sợ bớt dữ dằn.",
        "author": "Thiên Ân",
        "date": "07 Mar 2024",
        "readingTime": "8 phút",
        "heroImage": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người đặt tay lên ngực khi nhắm mắt",
        "secondaryImage": "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Ánh sáng chiếu qua cửa sổ im ắng",
        "intro": [
            "Nỗi sợ không phải kẻ thù; nó là cơ chế bảo vệ giúp ta sống thận trọng. Tuy nhiên, khi không được lắng nghe, nỗi sợ sẽ phình to và điều khiển mọi quyết định.",
            "Đối thoại dịu dàng cho phép ta tách nỗi sợ khỏi bản ngã, nhìn xem nó muốn gửi gắm điều gì rồi trả lời bằng sự bình tĩnh.",
            "Chỉ cần vài tờ giấy và một không gian yên tĩnh, bạn có thể biến nỗi sợ thành dữ liệu để chăm sóc."
        ],
        "sections": [
            {
                "heading": "Vẽ bản đồ nỗi sợ",
                "paragraphs": [
                    "Chia tờ giấy thành bốn ô: tình huống, cảm giác cơ thể, suy nghĩ xuất hiện và hành động tự động. Viết thật cụ thể để nỗi sợ có hình dạng rõ ràng.",
                    "Khi nhìn nỗi sợ trên giấy, bạn dễ nhận ra yếu tố kích hoạt và chuẩn bị phương án ứng phó thay vì bị cuốn vào vòng xoáy."
                ]
            },
            {
                "heading": "Viết thư trấn an",
                "paragraphs": [
                    "Sau khi hoàn thành sơ đồ, viết một lá thư ngắn gửi đến nỗi sợ với câu mở đầu “Mình nghe bạn muốn nói rằng…”. Giọng văn nhẹ nhàng giúp hệ thần kinh hiểu rằng bạn vẫn an toàn.",
                    "Bạn cũng có thể viết thư ngược lại: “Nỗi sợ gửi tôi”, để thấy mặt tích cực của nó – thường là mong muốn bảo vệ bạn khỏi nỗi đau cũ."
                ]
            },
            {
                "heading": "Thiết kế nghi thức kết thúc",
                "paragraphs": [
                    "Đừng để bản đồ nỗi sợ nằm lăn lóc khiến bạn cứ phải nhìn lại mỗi ngày. Hãy gấp chúng vào phong bì, ghi ngày sẽ xem lại hoặc đốt đi nếu cảm thấy nhẹ lòng.",
                    "Việc chỉ định thời điểm quay lại giúp nỗi sợ không chiếm toàn bộ lịch trình. Khi đến ngày đã hẹn, bạn có thể xem mình đã trưởng thành ra sao."
                ]
            }
        ],
        "quote": "Nỗi sợ dịu đi khi ta công nhận sự tồn tại của nó và đặt tay lên tim để nói: “Một mình bạn không phải chiến đấu đâu”.",
        "quote_after_section": 1,
        "practices": [
            "Đặt tên thân thiện cho nỗi sợ để dễ trò chuyện, ví dụ “bé Hoảng Hốt”.",
            "Chuẩn bị playlist êm dịu để bật trong lúc viết thư trấn an.",
            "Sau mỗi cuộc đối thoại, ghi lại điều nỗi sợ đã bảo vệ bạn tốt ra sao."
        ],
        "closing": [
            "Đối thoại với nỗi sợ là hành trình luyện lòng can đảm. Bạn càng trung thực bao nhiêu, nỗi sợ càng bớt dữ dằn bấy nhiêu.",
            "Một ngày kia, bạn sẽ nhận ra nỗi sợ thật ra chỉ là phần rất nhỏ đang mong được che chở."
        ]
    },
    {
        "slug": "thien-tho-5-phut-noi-cong-so",
        "title": "Thiền thở 5 phút nơi công sở",
        "tag": "Thiền thở",
        "category": "Thiền thở",
        "description": "Thiết lập góc thở, sử dụng chu trình 4-6-4 và neo cảm xúc bằng câu khẳng định.",
        "author": "Hướng Dương",
        "date": "06 Mar 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Nhân viên hít thở bên cửa sổ văn phòng",
        "secondaryImage": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Bàn làm việc sáng sủa với chậu cây nhỏ",
        "intro": [
            "Bạn không cần một thiền đường yên tĩnh để hít thở sâu; 5 phút ở văn phòng cũng đủ để làm mới hệ thần kinh.",
            "Thiền thở giữa ngày giúp não thoát khỏi chế độ chiến đấu, tim đập chậm lại và sự tập trung quay trở về.",
            "Hãy xem đây là nghi thức reset năng lượng, giống như nhấn nút refresh cho trình duyệt."
        ],
        "sections": [
            {
                "heading": "Thiết lập góc thở mini",
                "paragraphs": [
                    "Chọn một chiếc ghế gần cửa sổ, đặt thêm một chậu cây hoặc viên đá để đánh dấu “đây là góc thở”. Khi nhìn thấy vật nhắc này, não bộ sẽ tự động bước vào chế độ thư giãn.",
                    "Thỏa thuận với đồng nghiệp rằng khi bạn đặt viên đá lên bàn là lúc bạn đang nghỉ thở, cần vài phút riêng tư."
                ]
            },
            {
                "heading": "Chu trình thở 4-6-4",
                "paragraphs": [
                    "Hít vào bằng mũi 4 nhịp, giữ 6 nhịp và thở ra 4 nhịp bằng miệng, lặp lại tối thiểu 6 vòng. Nhịp giữ dài hơn giúp hệ thần kinh chuyển sang trạng thái thư thái.",
                    "Trong lúc thở, tưởng tượng không khí đang quét sạch căng thẳng ra khỏi vai và gáy."
                ]
            },
            {
                "heading": "Neo cảm xúc bằng câu khẳng định",
                "paragraphs": [
                    "Kết thúc 5 phút bằng câu khẳng định nhẹ nhàng: “Mình đang ổn và đủ sáng suốt cho bước tiếp theo”. Nói ra thành tiếng nếu có thể.",
                    "Viết câu khẳng định vào sổ tay hoặc dán lên màn hình để nhắc mình trở về hơi thở bất cứ lúc nào."
                ]
            }
        ],
        "quote": "Chỉ một phút thở có ý thức cũng đủ mạnh hơn mười phút lướt mạng vô định.",
        "quote_after_section": 0,
        "practices": [
            "Đặt báo thức vào 10h và 15h hằng ngày với tiêu đề “Đã đến giờ thở”.",
            "Sử dụng ứng dụng đếm nhịp nếu bạn mới bắt đầu.",
            "Rủ đồng nghiệp thực hành chung để tạo văn hóa làm việc lành mạnh."
        ],
        "closing": [
            "Sau vài tuần, bạn sẽ thấy cơ thể chủ động đòi hỏi những phút nghỉ thở và tâm trí bớt cáu gắt hơn.",
            "Thiền thở nơi công sở chính là lời nhắc rằng bạn có quyền bảo vệ sự bình an của mình ngay giữa guồng quay bận rộn."
        ]
    },
    {
        "slug": "viet-thu-cho-chinh-minh-muoi-nam",
        "title": "Viết thư cho chính mình sau 10 năm",
        "tag": "Viết tay",
        "category": "Viết tay",
        "description": "Nghi thức viết thư hướng tới tương lai để củng cố giá trị và lòng biết ơn hiện tại.",
        "author": "Thu Hà",
        "date": "05 Mar 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người viết thư tay bên cửa sổ nắng",
        "secondaryImage": "https://images.unsplash.com/photo-1500534310683-79e79c7cda30?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Bộ thư cụ với phong bì và bút máy",
        "intro": [
            "Viết thư cho chính mình trong tương lai là cách đẹp đẽ để ghi nhận hành trình hiện tại. Bạn vừa tạo kỷ niệm, vừa gửi năng lượng yêu thương đến phiên bản sẽ xuất hiện sau 10 năm.",
            "Lá thư giúp bạn xác định điều thật sự quan trọng, đồng thời trao niềm tin rằng tương lai vẫn đang được bạn chăm sóc từ bây giờ.",
            "Bạn chỉ cần một không gian yên tĩnh, vài tờ giấy và sự trung thực."
        ],
        "sections": [
            {
                "heading": "Chuẩn bị nghi thức trang trọng",
                "paragraphs": [
                    "Dọn gọn bàn, bật một bản nhạc bạn yêu thích và thắp nến. Sự trang trọng khiến bạn nghiêm túc với từng câu chữ.",
                    "Hít sâu vài nhịp trước khi viết để tâm trí không bị phân tán."
                ]
            },
            {
                "heading": "Cấu trúc 3 phần cho lá thư",
                "paragraphs": [
                    "Phần đầu: cảm ơn phiên bản tương lai vì đã can đảm tiếp tục sống đúng giá trị. Phần giữa: kể lại câu chuyện bạn đang sống, bao gồm cả khó khăn và bài học.",
                    "Phần cuối: gửi lời chúc cụ thể, ví dụ mong mình vẫn giữ thói quen đọc sách, hay vẫn thân thiết với người bạn hiện tại."
                ]
            },
            {
                "heading": "Chọn thời điểm mở thư",
                "paragraphs": [
                    "Niêm phong lá thư, ghi rõ ngày mở và cất ở nơi an toàn. Bạn có thể đặt lịch trong điện thoại hoặc gửi qua dịch vụ email hẹn giờ.",
                    "Cảm giác chờ đợi được gặp lại chính mình sẽ giúp bạn kiên định với những mục tiêu dài hạn."
                ]
            }
        ],
        "quote": "Mỗi trang thư gửi tương lai là lời nhắc bạn luôn có một đồng minh mang tên chính mình.",
        "quote_after_section": 2,
        "practices": [
            "Lập nhóm bạn thân để cùng viết và trao đổi lá thư của nhau.",
            "Kèm theo vài bức ảnh, vé tàu hoặc vật kỷ niệm trong phong bì.",
            "Viết thêm một lá thư gửi về quá khứ để thực hành sự tha thứ."
        ],
        "closing": [
            "Thư gửi tương lai giúp bạn thấy hành trình hiện tại đáng quý đến nhường nào.",
            "Hãy kiên trì với nghi thức này mỗi 2-3 năm để tạo chuỗi đối thoại đầy yêu thương với chính mình."
        ]
    },
    {
        "slug": "gioi-han-lanh-manh-voi-the-gioi-so",
        "title": "Đặt giới hạn lành mạnh với thế giới số",
        "tag": "Digital detox",
        "category": "Digital detox",
        "description": "Thiết lập khung giờ offline, lọc nội dung và nuôi dưỡng sự thảnh thơi khi online.",
        "author": "An Bình",
        "date": "04 Mar 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Điện thoại đặt úp trên cuốn sách",
        "secondaryImage": "https://images.unsplash.com/photo-1484981138541-b1af6c5314cb?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Người đọc sách bên cửa sổ sáng",
        "intro": [
            "Mạng xã hội là công cụ kết nối tuyệt vời nhưng cũng dễ khiến ta kiệt sức nếu không có ranh giới rõ ràng.",
            "Giới hạn lành mạnh không nhằm cắt đứt internet, mà để ta chủ động chọn nội dung nuôi dưỡng thay vì bị cuốn đi.",
            "Bạn có thể bắt đầu bằng ba thay đổi nhỏ: khung giờ offline, danh sách theo dõi lành mạnh và góc offline nuôi dưỡng."
        ],
        "sections": [
            {
                "heading": "Khung giờ offline cố định",
                "paragraphs": [
                    "Chọn ít nhất hai khoảng thời gian mỗi ngày – ví dụ 6-8h sáng và 21-22h tối – để tắt hoàn toàn dữ liệu, cất điện thoại ở phòng khác.",
                    "Thông báo cho gia đình để họ yên tâm và tôn trọng khoảng offline của bạn."
                ]
            },
            {
                "heading": "Tinh chỉnh thuật toán",
                "paragraphs": [
                    "Unfollow những tài khoản khiến bạn so sánh hoặc lo lắng. Thay vào đó, theo dõi các kênh nghệ thuật, chữa lành, thiên nhiên.",
                    "Mỗi khi mạng xã hội gợi ý nội dung tiêu cực, hãy chọn “không quan tâm” để thuật toán hiểu ý bạn."
                ]
            },
            {
                "heading": "Xây góc offline đáng yêu",
                "paragraphs": [
                    "Chuẩn bị một góc nhỏ với sách giấy, máy ảnh film hoặc dụng cụ thủ công. Mỗi khi cảm thấy tay muốn lướt điện thoại, hãy chuyển tới góc này.",
                    "Khi biết mình luôn có hoạt động thú vị ngoài màn hình, việc giảm thời gian online sẽ dễ hơn."
                ]
            }
        ],
        "quote": "Ranh giới với thế giới số chính là món quà bạn tặng cho sự tĩnh lặng bên trong.",
        "quote_after_section": 1,
        "practices": [
            "Dùng ứng dụng đo thời gian online và tự thưởng nếu đạt mục tiêu tuần.",
            "Đặt câu hỏi trước khi mở mạng xã hội: “Mình vào đây để làm gì?”.",
            "Thực hiện “Chủ nhật không mạng xã hội” mỗi tháng một lần."
        ],
        "closing": [
            "Sau một thời gian, bạn sẽ nhận thấy đầu óc nhẹ hơn và khả năng tập trung được phục hồi.",
            "Giới hạn lành mạnh giúp bạn sống có mặt hơn với những người ngay trước mặt."
        ]
    },
    {
        "slug": "buoi-sang-tinh-thuc-10-phut",
        "title": "Buổi sáng tỉnh thức 10 phút",
        "tag": "Thói quen",
        "category": "Thói quen",
        "description": "Công thức 10 phút gồm cảm giác, chuyển động và lời dẫn đường để khởi động ngày mới.",
        "author": "Mai Phương",
        "date": "03 Mar 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người duỗi tay đón nắng buổi sáng",
        "secondaryImage": "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Ly nước ấm đặt trên bàn gỗ",
        "intro": [
            "10 phút đầu ngày quyết định phần còn lại sẽ diễn ra với năng lượng nào. Nếu bạn bắt đầu bằng sự vội vàng, cả ngày sẽ nối dài với căng thẳng.",
            "Một buổi sáng tỉnh thức không cần cầu kỳ; chỉ cần nhắc nhở giác quan, chuyển động nhẹ và đặt lời dẫn đường cho tâm trí.",
            "Hãy thử công thức 10 phút này để xây dựng nền móng bình an."
        ],
        "sections": [
            {
                "heading": "Phút 1-3: Đánh thức giác quan",
                "paragraphs": [
                    "Mở cửa sổ, chạm chân trần xuống sàn và uống một ngụm nước ấm. Nhìn ra ngoài trời và gọi tên ba màu sắc bạn nhìn thấy.",
                    "Sự chú ý vào giác quan giúp não thoát khỏi chế độ mơ ngủ và kết nối với hiện tại."
                ]
            },
            {
                "heading": "Phút 4-7: Chuyển động dịu dàng",
                "paragraphs": [
                    "Thực hiện vài động tác kéo giãn cổ, xoay vai, gập người. Hãy cảm nhận từng đốt sống đang được đánh thức.",
                    "Bạn có thể bật nhạc nhẹ và mỉm cười với chính mình trong gương."
                ]
            },
            {
                "heading": "Phút 8-10: Đặt lời dẫn đường",
                "paragraphs": [
                    "Viết một câu khẳng định tích cực như “Hôm nay tôi hiện diện trong từng cuộc trò chuyện”. Chọn một trọng tâm duy nhất cho ngày mới.",
                    "Đọc to câu khẳng định và chạm tay lên tim để neo lại năng lượng."
                ]
            }
        ],
        "quote": "Trạng thái bạn gieo vào buổi sáng sẽ là nền đất cho mọi quyết định trong ngày.",
        "quote_after_section": 2,
        "practices": [
            "Chuẩn bị sẵn playlist “10 phút tỉnh thức” để bật ngay sau khi thức dậy.",
            "Đặt cuốn sổ nhỏ và bút ở cạnh giường.",
            "Nếu lỡ bỏ qua, đừng trách mình; chỉ cần bắt đầu lại vào sáng hôm sau."
        ],
        "closing": [
            "Sau 30 ngày, công thức 10 phút sẽ trở thành phản xạ. Bạn sẽ thấy bản thân bình tĩnh hơn trước những bất ngờ trong ngày.",
            "Hãy tùy biến thêm yếu tố riêng như cầu nguyện, đọc thơ, miễn là giữ trọng tâm tỉnh thức."
        ]
    },
    {
        "slug": "ban-do-binh-an-trong-nha",
        "title": "Bản đồ bình an trong nhà",
        "tag": "Không gian sống",
        "category": "Không gian sống",
        "description": "Thiết kế ba góc nhỏ: góc thở, bàn sáng tạo và kệ tri ân để nuôi dưỡng năng lượng.",
        "author": "Gia Yên",
        "date": "02 Mar 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Góc nhà nhiều ánh sáng với cây xanh",
        "secondaryImage": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Kệ sách gọn gàng và vật trang trí nhỏ",
        "intro": [
            "Ngôi nhà không chỉ là địa điểm ở mà còn là hệ sinh thái nuôi dưỡng cảm xúc. Khi bước vào nhà và cảm thấy bình yên, bạn sẽ hồi phục nhanh hơn sau một ngày dài.",
            "Bản đồ bình an trong nhà tập trung vào ba điểm chạm: góc thở, bàn sáng tạo và kệ tri ân. Mỗi góc đại diện cho một nhu cầu: tĩnh lặng, biểu đạt và kết nối.",
            "Chỉ cần vài thay đổi nhỏ, bạn đã có thể khiến không gian sống trở thành trạm sạc tinh thần."
        ],
        "sections": [
            {
                "heading": "Góc thở sâu cạnh cửa sổ",
                "paragraphs": [
                    "Chọn một góc gần ánh sáng tự nhiên, trải tấm thảm nhỏ, đặt gối tựa và bình tinh dầu. Đây sẽ là nơi bạn ngồi uống trà, thiền hoặc đọc sách ngắn.",
                    "Thắp nến hoặc bật đèn vàng mỗi khi tới góc này để báo hiệu cho cơ thể rằng đây là thời gian nghỉ."
                ]
            },
            {
                "heading": "Bàn sáng tạo tối giản",
                "paragraphs": [
                    "Chỉ giữ lại những dụng cụ bạn thực sự dùng: sổ phác thảo, hộp màu nước, máy ảnh film. Mặt bàn thông thoáng giúp ý tưởng xuất hiện dễ dàng.",
                    "Trang trí bằng bảng cảm hứng hoặc câu trích dẫn yêu thích để khơi gợi tinh thần khám phá."
                ]
            },
            {
                "heading": "Kệ tri ân gia đình",
                "paragraphs": [
                    "Trưng bày ảnh gia đình, thư tay, món quà nhỏ của bạn bè. Mỗi lần đi ngang hãy dừng lại vài giây để nói lời cảm ơn thầm.",
                    "Những vật phẩm mang câu chuyện giúp bạn cảm thấy được nâng đỡ cho dù sống một mình."
                ]
            }
        ],
        "quote": "Không gian bạn sống phản chiếu câu chuyện bạn đang kể với chính mình.",
        "quote_after_section": 2,
        "practices": [
            "Vẽ sơ đồ nhà và đánh dấu góc cần được làm mới.",
            "Đặt lịch dọn góc thở mỗi thứ Sáu để giữ năng lượng sạch.",
            "Tạo playlist “ở nhà” để bật khi dọn dẹp."
        ],
        "closing": [
            "Khi ngôi nhà trở thành người bạn đồng hành, bạn sẽ bớt cần chạy trốn ra bên ngoài để tìm bình yên.",
            "Hãy bắt đầu từ chi tiết nhỏ nhất – một chiếc khăn mới hay lọ hoa dại – rồi quan sát cách tâm trạng bạn thay đổi."
        ]
    },
    {
        "slug": "nghi-thuc-buoi-toi-khong-man-hinh",
        "title": "Nghi thức buổi tối không màn hình",
        "tag": "Giấc ngủ",
        "category": "Giấc ngủ",
        "description": "Lộ trình 30 phút gồm tắt thiết bị, chăm sóc cơ thể và thư giãn bằng giấy mực.",
        "author": "Hoài An",
        "date": "01 Mar 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Đèn ngủ vàng ấm và cuốn sách",
        "secondaryImage": "https://images.unsplash.com/photo-1444047427283-88a67f631b3e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Tách trà thảo mộc buổi tối",
        "intro": [
            "Ánh sáng xanh khiến não bộ tin rằng ngày vẫn chưa kết thúc, dẫn đến khó ngủ và ngủ không sâu.",
            "Một nghi thức buổi tối không màn hình giúp cơ thể chuyển từ trạng thái hoạt động sang nghỉ ngơi, giống như chiếc cầu nối mềm mại.",
            "Chỉ cần 30 phút với ba bước đơn giản, bạn sẽ ngủ sớm hơn và thức dậy nhẹ nhàng."
        ],
        "sections": [
            {
                "heading": "Chuông báo tắt thiết bị",
                "paragraphs": [
                    "Đặt báo thức lúc 21:30 để nhắc mình tắt điện thoại, máy tính. Cất chúng ở phòng khác và chuyển sang ánh sáng vàng dịu.",
                    "Thói quen này giúp não bộ hiểu rằng đã đến giờ nghỉ."
                ]
            },
            {
                "heading": "Ba lớp chăm sóc cơ thể",
                "paragraphs": [
                    "Tắm nước ấm, bôi kem dưỡng, đeo tất cotton để giữ ấm bàn chân. Cơ thể được chăm sóc sẽ sẵn sàng bước vào giấc ngủ sâu.",
                    "Có thể thêm vài động tác kéo giãn nhẹ hoặc massage vai gáy."
                ]
            },
            {
                "heading": "Thư giãn bằng giấy mực",
                "paragraphs": [
                    "Viết ba điều hoàn thành trong ngày và điều bạn kỳ vọng ngày mai. Sau đó đọc vài trang sách giấy hoặc nghe podcast nhẹ nhàng.",
                    "Kết thúc nghi thức bằng việc tắt đèn khi mắt đã cảm thấy nặng trĩu."
                ]
            }
        ],
        "quote": "Giấc ngủ sâu bắt đầu từ quyết định tôn trọng giờ nghỉ của chính mình.",
        "quote_after_section": 1,
        "practices": [
            "Dùng hộp đựng điện thoại đặt ngoài phòng ngủ.",
            "Chuẩn bị sẵn sổ tay và cây bút ở đầu giường.",
            "Nếu cần nghe nhạc, hãy dùng loa ngoài thay vì nhìn vào màn hình."
        ],
        "closing": [
            "Sau hai tuần, đồng hồ sinh học sẽ điều chỉnh và bạn không còn phải gượng ép mình đi ngủ.",
            "Hãy chia sẻ nghi thức này với gia đình để mọi người cùng tận hưởng buổi tối yên tĩnh."
        ]
    },
    {
        "slug": "xu-ly-cam-giac-toi-loi",
        "title": "Xử lý cảm giác tội lỗi",
        "tag": "Chữa lành",
        "category": "Chữa lành",
        "description": "Phân biệt lỗi thực tế – lỗi tưởng tượng, rồi chuyển thành hành động chữa lành cụ thể.",
        "author": "Tường Vy",
        "date": "29 Feb 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người quàng chăn nhìn ra cửa sổ",
        "secondaryImage": "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Ánh nắng nhẹ chiếu qua rèm",
        "intro": [
            "Cảm giác tội lỗi có thể trở thành động lực sửa sai, nhưng nếu kéo dài sẽ biến thành hòn đá buộc chân. Ta tự trừng phạt dù sự việc đã qua.",
            "Điều quan trọng là phân biệt đâu là lỗi thực tế cần hành động, đâu chỉ là câu chuyện ta kể với chính mình.",
            "Bộ công cụ nhỏ dưới đây giúp bạn đi qua tội lỗi bằng sự tỉnh thức."
        ],
        "sections": [
            {
                "heading": "Ghi bảng sự kiện – cảm xúc",
                "paragraphs": [
                    "Viết lại sự việc theo dạng cột: sự kiện khách quan, điều bạn nghĩ, điều bạn cảm nhận. Bảng này giúp tách dữ kiện khỏi phán xét.",
                    "Nếu thiếu thông tin, hãy đánh dấu và hứa với bản thân sẽ kiểm chứng thay vì tự suy đoán."
                ]
            },
            {
                "heading": "Chọn hành động bù đắp khả thi",
                "paragraphs": [
                    "Với lỗi thực tế, hãy hỏi người liên quan họ mong đợi điều gì. Có thể là lời xin lỗi, bù đắp tài chính hoặc đơn giản là cam kết không lặp lại.",
                    "Nếu lỗi chỉ tồn tại trong suy nghĩ, hành động bù đắp chính là tha thứ cho bản thân và học bài học cần thiết."
                ]
            },
            {
                "heading": "Thiết lập cam kết mới",
                "paragraphs": [
                    "Viết ra điều bạn sẽ làm khác đi trong tương lai. Cam kết càng cụ thể, tội lỗi càng ít cơ hội tái diễn.",
                    "Đặt lời nhắc để kiểm tra tiến độ sau một tuần, một tháng."
                ]
            }
        ],
        "quote": "Tội lỗi chỉ hữu ích khi nó dẫn ta đến hành động yêu thương hơn.",
        "quote_after_section": 2,
        "practices": [
            "Thực hiện bài tập “viết thư xin lỗi” dù bạn không gửi đi.",
            "Chia sẻ cảm giác với người đáng tin để tránh ở một mình với nỗi tự trách.",
            "Khi tội lỗi trở lại, nhắc mình rằng bạn đang học cách làm tốt hơn chứ không phải người xấu."
        ],
        "closing": [
            "Tha thứ cho chính mình là món quà giúp bạn tiếp tục sống tử tế.",
            "Mỗi lần bạn chọn học bài học thay vì tự phán xét, vòng lặp tội lỗi sẽ yếu đi."
        ]
    },
    {
        "slug": "don-dep-tam-tri-cuoi-tuan",
        "title": "Dọn dẹp tâm trí cuối tuần",
        "tag": "Tâm trí",
        "category": "Tâm trí",
        "description": "Checklist 4 bước để gom suy nghĩ, sắp lịch và khởi động tuần mới nhẹ nhõm.",
        "author": "Bình Minh",
        "date": "27 Feb 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người sắp xếp bàn làm việc với máy tính và sổ",
        "secondaryImage": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Bàn làm việc gọn gàng với đèn bàn",
        "intro": [
            "Cuối tuần không chỉ để giặt giũ hay đi chợ; đó còn là thời gian dọn dẹp tâm trí để tuần mới bắt đầu nhẹ nhàng.",
            "Một quy trình rõ ràng giúp bạn không mang theo lo toan sang thứ Hai và dành được chỗ trống cho điều quan trọng.",
            "Checklist dưới đây chỉ mất 30 phút nhưng mang lại cảm giác chủ động và tự do."
        ],
        "sections": [
            {
                "heading": "Gom mảnh suy nghĩ",
                "paragraphs": [
                    "Mở một trang giấy và viết tất cả việc còn dang dở, ý tưởng chợt đến, cuộc trò chuyện cần tiếp tục. Đừng phân loại ngay, cứ để chúng tuôn ra.",
                    "Khi mọi thứ nằm ở cùng một nơi, não bộ không còn phải giữ chúng trong chế độ cảnh báo."
                ]
            },
            {
                "heading": "Phân loại và hẹn giờ",
                "paragraphs": [
                    "Đánh dấu việc cần làm ngay, việc có thể ủy thác và việc có thể bỏ. Với từng nhóm, chặn khung giờ cụ thể trong lịch tuần tới.",
                    "Việc đặt lịch biến lời hứa với bản thân thành hành động thực tế."
                ]
            },
            {
                "heading": "Nghi thức đóng tuần",
                "paragraphs": [
                    "Kết thúc bằng tách trà hoặc bản nhạc yêu thích để thông báo với cơ thể rằng tuần cũ đã khép lại.",
                    "Bạn có thể ghi lại ba điều học được trong tuần để cảm thấy biết ơn hơn về hành trình của mình."
                ]
            }
        ],
        "quote": "Tâm trí gọn gàng tạo ra bệ phóng cho sự sáng tạo.",
        "quote_after_section": 1,
        "practices": [
            "Đặt lời nhắc “Dọn tâm trí” vào chiều thứ Bảy.",
            "Sử dụng bảng trắng hoặc ứng dụng quản lý nhiệm vụ để trực quan hóa công việc.",
            "Tự thưởng một hoạt động thư giãn sau khi hoàn thành checklist."
        ],
        "closing": [
            "Tuần mới sẽ chào đón bạn bằng cảm giác nhẹ nhõm thay vì hỗn độn.",
            "Khi tâm trí đã được dọn dẹp, bạn sẽ có thêm không gian cho những ý tưởng thú vị."
        ]
    },
    {
        "slug": "thoat-khoi-can-benh-hoan-hao",
        "title": "Thoát khỏi căn bệnh hoàn hảo",
        "tag": "Phát triển bản thân",
        "category": "Phát triển bản thân",
        "description": "Bộ 3 chiến lược: đặt thời hạn thân thiện, chia bản nháp và ôm lấy phản hồi.",
        "author": "Song Kha",
        "date": "25 Feb 2024",
        "readingTime": "7 phút",
        "heroImage": "https://images.unsplash.com/photo-1453227588063-bb302b62f50b?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người đứng trên ngọn đồi gió lộng",
        "secondaryImage": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Sổ tay mở với bút chì và kính",
        "intro": [
            "Chủ nghĩa hoàn hảo khiến ta trì hoãn những dự án quan trọng vì sợ sai sót. Càng chờ đợi, nỗi sợ càng lớn.",
            "Thoát khỏi nó nghĩa là cho phép mình phát hành phiên bản đang học hỏi, nhận phản hồi rồi tiến bộ.",
            "Bộ 3 chiến lược dưới đây giúp bạn dám bước ra ánh sáng."
        ],
        "sections": [
            {
                "heading": "Đặt thời hạn thân thiện",
                "paragraphs": [
                    "Chia dự án thành ba mốc: bản nháp, bản beta, bản chính thức. Mỗi mốc chỉ tập trung vào một tiêu chí chất lượng.",
                    "Việc định nghĩa rõ mục tiêu cho từng mốc giúp bạn không cố nhồi nhét mọi thứ ngay từ đầu."
                ]
            },
            {
                "heading": "Chia sẻ bản nháp sớm",
                "paragraphs": [
                    "Gửi bản nháp cho nhóm bạn tin tưởng cùng câu hỏi rõ ràng như “Phần nào gây khó hiểu nhất?”.",
                    "Bạn sẽ nhận được góp ý cụ thể thay vì những nhận xét chung chung – thứ dễ làm tổn thương cái tôi."
                ]
            },
            {
                "heading": "Ôm lấy phản hồi",
                "paragraphs": [
                    "Ghi lại mọi phản hồi vào cùng một tài liệu và phân loại: cần làm ngay, cân nhắc sau, không phù hợp.",
                    "Nhìn phản hồi như dữ liệu để sản phẩm tốt hơn, không phải phán xét giá trị con người bạn."
                ]
            }
        ],
        "quote": "Sự hoàn hảo thực chất là một điểm hẹn không tồn tại.",
        "quote_after_section": 2,
        "practices": [
            "Đặt lời nhắc ăn mừng mỗi khi hoàn thành một phiên bản nhỏ.",
            "Viết lại câu thần chú: “Tiến bộ quan trọng hơn hoàn hảo”.",
            "Tìm người đồng hành để nhắc nhau gửi bản nháp đúng hạn."
        ],
        "closing": [
            "Khi bạn dám xuất bản phiên bản chưa hoàn thiện, con đường học hỏi sẽ rộng mở.",
            "Hãy nhớ rằng phiên bản đáng yêu nhất chính là phiên bản đang trưởng thành từng ngày."
        ]
    },
    {
        "slug": "uong-nuoc-cham-de-tinh-tam",
        "title": "Uống nước chậm để tĩnh tâm",
        "tag": "Sức khỏe",
        "category": "Sức khỏe",
        "description": "Biến việc uống nước thành nghi thức chánh niệm giúp kết nối thân – tâm.",
        "author": "Mộc Lam",
        "date": "23 Feb 2024",
        "readingTime": "5 phút",
        "heroImage": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Ly nước trong với lát chanh",
        "secondaryImage": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Người cầm ly nước bằng hai tay",
        "intro": [
            "Một ngụm nước uống vội không thể giúp cơ thể hồi sức. Nhưng nếu dành hai phút, bạn có thể biến việc uống nước thành nghi thức tĩnh tâm.",
            "Nghi thức này đánh thức các giác quan, giúp bạn quay về với cơ thể giữa ngày bận rộn.",
            "Bạn chỉ cần một chiếc ly đẹp và sự chú ý dịu dàng."
        ],
        "sections": [
            {
                "heading": "Kích hoạt giác quan",
                "paragraphs": [
                    "Rót nước vào ly thủy tinh, quan sát ánh sáng phản chiếu, nghe tiếng nước chạm vào thành ly.",
                    "Trước khi uống, đặt ly gần mũi để cảm nhận mùi vị (bạn có thể thêm vài lát chanh hoặc lá bạc hà)."
                ]
            },
            {
                "heading": "Uống chậm và quan sát",
                "paragraphs": [
                    "Ngậm nước trong miệng vài giây, cảm nhận nhiệt độ, để nước chạm nhẹ đầu lưỡi trước khi nuốt.",
                    "Theo dõi cảm giác mát lan xuống cổ họng, ngực và bụng. Đây chính là khoảnh khắc bạn kết nối lại với thân thể."
                ]
            },
            {
                "heading": "Gửi lời chúc",
                "paragraphs": [
                    "Trước mỗi ngụm, thầm nói câu chúc như “Mong cơ thể luôn khỏe mạnh” hoặc “Mong tâm trí được sáng tỏ”.",
                    "Lời chúc giúp não bộ gắn việc uống nước với cảm giác an toàn và được chăm sóc."
                ]
            }
        ],
        "quote": "Khi uống nước chậm, bạn đang nhắc mình cũng xứng đáng được nâng niu.",
        "quote_after_section": 2,
        "practices": [
            "Đặt bình nước đẹp mắt trên bàn làm việc để luôn nhớ uống.",
            "Dùng ứng dụng nhắc uống nước nhưng gắn kèm câu hỏi “Bạn đã thật sự cảm nhận ngụm nước này chưa?”.",
            "Thêm lát trái cây theo mùa để tạo sự hứng thú."
        ],
        "closing": [
            "Nghi thức nhỏ này sẽ trở thành chiếc neo kéo bạn về hiện tại mỗi khi tâm trí rối bời.",
            "Hãy chia sẻ với đồng nghiệp để giờ nghỉ nước cũng trở thành giờ thư giãn chung."
        ]
    },
    {
        "slug": "om-lay-im-lang-co-y",
        "title": "Ôm lấy im lặng có ý",
        "tag": "Tĩnh lặng",
        "category": "Tĩnh lặng",
        "description": "Thực hành ẩn tu mini 15 phút mỗi ngày để lắng nghe nhịp tim và tiếng vọng của linh hồn.",
        "author": "Hà Mi",
        "date": "21 Feb 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1477511801984-4ad318ed9846?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Cánh rừng yên tĩnh phủ sương",
        "secondaryImage": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Người ngồi thiền cạnh cửa sổ",
        "intro": [
            "Im lặng không phải khoảng trống đáng sợ mà là món quà hiếm trong thời đại ồn ào. Khi ta cho phép mình lặng im, những tầng cảm xúc sâu mới có cơ hội cất tiếng.",
            "Ẩn tu mini 15 phút mỗi ngày giúp ta luyện cơ bắp tĩnh lặng mà không cần rời khỏi thành phố.",
            "Tất cả những gì bạn cần là tuyên bố ranh giới, chiếc ghế êm và hơi thở đều đặn."
        ],
        "sections": [
            {
                "heading": "Tuyên bố im lặng",
                "paragraphs": [
                    "Thông báo với người thân hoặc đồng nghiệp rằng bạn sẽ bước vào 15 phút không nói, không nghe. Việc này giúp bạn không cảm thấy áy náy khi tạm rời cuộc trò chuyện.",
                    "Đặt chế độ “không làm phiền” trên điện thoại để tránh bị ngắt quãng."
                ]
            },
            {
                "heading": "Ngồi cùng im lặng",
                "paragraphs": [
                    "Chọn tư thế thoải mái, đặt tay lên tim và chú ý đến âm thanh xa xăm. Không cần cố gắng ép suy nghĩ biến mất; chỉ cần để chúng trôi qua như những đám mây.",
                    "Nếu cảm xúc mãnh liệt xuất hiện, hãy ghi nhận và hẹn sẽ viết lại sau khi kết thúc."
                ]
            },
            {
                "heading": "Ghi nhận sau ẩn tu",
                "paragraphs": [
                    "Viết vài dòng về điều bạn nhận ra trong 15 phút im lặng. Có thể chỉ là cảm giác dễ chịu ở bả vai hoặc sự xuất hiện của một ký ức đẹp.",
                    "Những ghi chú này giúp bạn thấy sự tinh tế trong hành trình ôm lấy im lặng."
                ]
            }
        ],
        "quote": "Im lặng là ngôn ngữ mà linh hồn hiểu rõ nhất.",
        "quote_after_section": 1,
        "practices": [
            "Lặp lại nghi thức im lặng vào cùng khung giờ mỗi ngày để tạo thói quen.",
            "Đeo tai nghe cách âm nếu môi trường xung quanh quá ồn.",
            "Thi thoảng, dành một buổi sáng cuối tuần không nói chuyện với ai để recharge sâu hơn."
        ],
        "closing": [
            "Khi bạn làm bạn với im lặng, những âm thanh đời sống cũng trở nên dễ chịu hơn.",
            "Im lặng có ý sẽ là nơi trú ẩn an toàn mỗi khi bạn cần trở về với chính mình."
        ]
    },
    {
        "slug": "nghe-thuat-noi-khong-chan-ai-day",
        "title": "Nghệ thuật nói không chân ái đấy",
        "tag": "Ranh giới",
        "category": "Ranh giới",
        "description": "Gợi ý câu từ và chiến lược giúp bạn đặt ranh giới mà vẫn giữ sự tử tế.",
        "author": "Ly Gia",
        "date": "19 Feb 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người phụ nữ mỉm cười đưa tay ra hiệu nhẹ nhàng",
        "secondaryImage": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Bàn tay đặt lên ngực giữ bình tĩnh",
        "intro": [
            "Nói không không phải ích kỷ; đó là cách bảo vệ điều quan trọng đối với bạn. Khi ranh giới rõ ràng, mối quan hệ lành mạnh hơn.",
            "Điều khó khăn nằm ở chỗ ta sợ làm buồn lòng người khác. Nhưng với sự chân thành và đề xuất thay thế, lời từ chối sẽ trở nên ấm áp.",
            "Bài viết này cung cấp những câu mẫu và chiến lược để bạn nói không mà vẫn giữ trái tim mềm mại."
        ],
        "sections": [
            {
                "heading": "Chuẩn bị câu nói mẫu",
                "paragraphs": [
                    "Viết sẵn một vài câu như: “Mình rất muốn giúp nhưng lịch tuần này đã kín” hoặc “Hiện tại mình đang ưu tiên nghỉ ngơi nên không thể tham gia”.",
                    "Khi đã có kịch bản, bạn sẽ bớt lúng túng và không bị cảm xúc dẫn dắt."
                ]
            },
            {
                "heading": "Đề nghị thay thế thân thiện",
                "paragraphs": [
                    "Nếu phù hợp, gợi ý thời điểm khác, giới thiệu người có thể hỗ trợ, hoặc gửi tài liệu tham khảo.",
                    "Điều này cho thấy bạn trân trọng lời mời nhưng cũng hiểu rõ giới hạn của mình."
                ]
            },
            {
                "heading": "Giữ vững sau khi từ chối",
                "paragraphs": [
                    "Sau khi nói không, đừng biện minh thêm quá nhiều vì dễ bị thuyết phục ngược. Chỉ cần nhắc lại rằng bạn đã cân nhắc kỹ.",
                    "Ghi nhận cảm xúc tội lỗi (nếu có) và nhắc mình rằng nói không với điều này nghĩa là nói có với điều quan trọng hơn."
                ]
            }
        ],
        "quote": "Nói không với điều không phù hợp chính là nói có với đời sống bạn thật sự mong muốn.",
        "quote_after_section": 2,
        "practices": [
            "Tập nói không trước gương để làm quen với ngữ điệu.",
            "Ghi nhật ký mỗi lần bạn đặt ranh giới thành công để củng cố niềm tin.",
            "Tự hỏi “Nếu mình đồng ý, điều gì bị hy sinh?” trước khi trả lời."
        ],
        "closing": [
            "Ranh giới rõ ràng là nền móng của sự tự do nội tâm.",
            "Khi bạn tôn trọng thời gian và năng lượng của mình, người khác cũng sẽ học cách tôn trọng."
        ]
    },
    {
        "slug": "di-bo-cham-trong-pho",
        "title": "Đi bộ chậm trong phố",
        "tag": "Chuyển động",
        "category": "Chuyển động",
        "description": "Hành trình 20 phút giúp bạn làm thân với thành phố theo cách dịu dàng.",
        "author": "Khải Minh",
        "date": "17 Feb 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Người đi bộ chậm trên con phố yên bình",
        "secondaryImage": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Đôi giày trên vạch qua đường",
        "intro": [
            "Đi bộ chậm giúp bạn nhìn thành phố bằng đôi mắt mới. Khi không vội vã, bạn sẽ nhận ra mùi hoa sữa đầu hẻm, tiếng rao sớm hay nụ cười của người bán hàng quen.",
            "Đây vừa là hoạt động vận động nhẹ, vừa là nghi thức kết nối với nơi mình sống.",
            "Hãy thử lộ trình 20 phút để xem trái tim dịu lại như thế nào."
        ],
        "sections": [
            {
                "heading": "Chọn tuyến đường gợi cảm hứng",
                "paragraphs": [
                    "Tìm con phố ít xe, có vỉa hè rộng hoặc nhiều cây xanh. Lặp lại tuyến đường này mỗi tuần để quan sát sự thay đổi nhỏ.",
                    "Bạn cũng có thể chọn đi qua những địa điểm gắn với kỷ niệm để trò chuyện với chính mình."
                ]
            },
            {
                "heading": "Đồng hành cùng giác quan",
                "paragraphs": [
                    "Trong 10 phút đầu, hãy đi trong im lặng để nghe trọn âm thanh đời sống. Sau đó, nếu muốn, bật playlist nhẹ để hòa cùng nhịp bước.",
                    "Chú ý đến nhịp tim, hơi thở và cảm giác bàn chân chạm mặt đường."
                ]
            },
            {
                "heading": "Khép lại bằng nghi thức nhỏ",
                "paragraphs": [
                    "Khi kết thúc, đứng yên một phút để cảm ơn đôi chân đã đưa bạn đi. Ghi lại vào sổ điều thú vị bạn nhìn thấy hôm nay.",
                    "Bạn cũng có thể chụp một bức ảnh làm kỷ niệm cho hành trình đi bộ chậm."
                ]
            }
        ],
        "quote": "Mỗi bước chân chậm rãi là một lời hỏi thăm dành cho chính mình.",
        "quote_after_section": 1,
        "practices": [
            "Đi bộ không điện thoại một lần mỗi tuần.",
            "Đổi tuyến đường sau mỗi tháng để làm mới trải nghiệm.",
            "Rủ người thân đi cùng nhưng thống nhất giữ nhịp chậm và ít nói."
        ],
        "closing": [
            "Bạn sẽ dần có cảm giác thành phố cũng đang ôm ấp mình.",
            "Đi bộ chậm là cách đơn giản nhất để trở nên thân thiết với nơi mình đang sống."
        ]
    },
    {
        "slug": "tri-an-nhung-nguoi-thuong",
        "title": "Tri ân những người thương",
        "tag": "Gắn kết",
        "category": "Gắn kết",
        "description": "Gửi lời tri ân đúng lúc để nuôi dưỡng sợi dây kết nối bền vững.",
        "author": "Thiên Ý",
        "date": "15 Feb 2024",
        "readingTime": "6 phút",
        "heroImage": "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
        "heroAlt": "Bạn bè ôm nhau trong ánh nắng",
        "secondaryImage": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        "secondaryAlt": "Hai bàn tay nắm lấy nhau",
        "intro": [
            "Tri ân không cần chờ dịp lễ lớn; chỉ cần trái tim chịu mở lời. Lời cảm ơn kịp thời làm ấm cả người nhận lẫn người gửi.",
            "Khi bày tỏ lòng biết ơn, chúng ta củng cố những sợi dây kết nối quan trọng, nhắc mình rằng không ai đi một mình.",
            "Hãy thiết kế nghi thức tri ân để tình thương được lưu thông."
        ],
        "sections": [
            {
                "heading": "Lập danh sách người nâng đỡ",
                "paragraphs": [
                    "Viết tên những người đã giúp bạn dù là hành động nhỏ: người pha cho bạn tách trà, đồng nghiệp hỗ trợ deadline, anh bảo vệ luôn nở nụ cười.",
                    "Danh sách này giúp bạn nhận ra mình giàu có tới mức nào về sự nâng đỡ."
                ]
            },
            {
                "heading": "Chọn hình thức tri ân",
                "paragraphs": [
                    "Có thể là thư tay, tin nhắn thoại, bó hoa nhỏ hay một bức ảnh kỷ niệm kèm lời nhắn.",
                    "Hãy nhắc lại khoảnh khắc cụ thể để họ biết họ đã tạo khác biệt ra sao."
                ]
            },
            {
                "heading": "Duy trì nhịp tri ân",
                "paragraphs": [
                    "Đặt lời nhắc hàng tuần gửi đi ít nhất một thông điệp cảm ơn. Điều này giúp vòng tròn yêu thương luôn vận hành.",
                    "Tri ân cả chính mình bằng cách ghi nhận nỗ lực đã bỏ ra."
                ]
            }
        ],
        "quote": "Tri ân là dòng chảy giúp trái tim không bao giờ khô hạn.",
        "quote_after_section": 0,
        "practices": [
            "Tạo lọ tri ân: mỗi khi nhận điều tốt đẹp, viết ra và bỏ vào lọ, cuối năm mở lại.",
            "Thực hiện “Ngày tri ân” mỗi tháng để gặp gỡ và cảm ơn người quan trọng.",
            "Dạy trẻ nhỏ viết thiệp cảm ơn để gieo mầm yêu thương."
        ],
        "closing": [
            "Khi lòng biết ơn được chia sẻ, sự gắn kết trở nên bền chặt hơn bao giờ hết.",
            "Bạn sẽ nhận ra mình chưa bao giờ đơn độc trên hành trình này."
        ]
    },
]


def escape(text: str) -> str:
    return html.escape(text, quote=False)


def build_post_html(post: dict) -> str:
    body_parts: list[str] = []

    for para in post.get("intro", []):
        body_parts.append(f"        <p>{escape(para)}</p>")

    for idx, section in enumerate(post.get("sections", [])):
        body_parts.append(f"        <h3>{escape(section['heading'])}</h3>")
        for para in section.get("paragraphs", []):
            body_parts.append(f"        <p>{escape(para)}</p>")
        if section.get("bullets"):
            body_parts.append("        <ul>")
            for item in section["bullets"]:
                body_parts.append(f"          <li>{escape(item)}</li>")
            body_parts.append("        </ul>")
        if post.get("quote") and post.get("quote_after_section") == idx:
            body_parts.append(f"        <div class=\"quote-card\">{escape(post['quote'])}</div>")

    body_parts.append(f"        <h3>Đưa {escape(post['title']).lower()} vào đời sống</h3>")
    body_parts.append(
        "        <p>"
        "Đặt lời nhắc định kỳ để rà soát xem bạn đã thực hành được gì trong tuần qua, điều gì vẫn còn ngập ngừng."
        " Ghi chú lại cả những thay đổi rất nhỏ để thấy được quãng đường mình đã đi."
        "</p>"
    )
    body_parts.append(
        "        <p>"
        "Khi thấy mình bị chững lại, hãy thay đổi bối cảnh: tìm một quán cà phê yên tĩnh, một chuyến xe buýt vòng quanh thành phố"
        " hoặc đơn giản là mở sổ tay và viết thư gửi chính mình. Những thay đổi nhỏ về không gian giúp bạn khơi lại cảm hứng."
        "</p>"
    )

    if post.get("secondaryImage"):
        body_parts.append(
            f"        <img class=\"article-image\" src=\"{post['secondaryImage']}\" alt=\"{escape(post.get('secondaryAlt', post['title']))}\" />"
        )

    if post.get("practices"):
        body_parts.append("        <h3>Gợi ý thực hành</h3>")
        body_parts.append("        <ul>")
        for item in post["practices"]:
            body_parts.append(f"          <li>{escape(item)}</li>")
        body_parts.append("        </ul>")

    for para in post.get("closing", []):
        body_parts.append(f"        <p>{escape(para)}</p>")

    body_html = "\n".join(body_parts)

    return f"""<!DOCTYPE html>
<html lang="vi" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{escape(post['title'])} | Triết lý Cuộc sống #1</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
    <header>
      <div class="container">
        <div class="navbar">
          <div class="brand">
            <img src="../assets/images/logo-text-new.svg" alt="Bookverse" width="140" height="32" />
          </div>
          <nav>
            <ul>
              <li>Trang chủ</li>
              <li>Suy niệm</li>
              <li>Thực hành</li>
              <li>Liên hệ</li>
            </ul>
          </nav>
          <div class="controls">
            <button class="theme-toggle" data-theme-toggle>Dark mode</button>
          </div>
        </div>
      </div>
    </header>

    <main class="container">
      <a class="back-link" href="../index.html">&larr; Về trang chủ</a>
      <article class="single-post">
        <p class="tag">{escape(post['tag'])}</p>
        <h1>{escape(post['title'])}</h1>
        <div class="meta">Đăng bởi {escape(post['author'])} · {escape(post['date'])} · Đọc trong {escape(post['readingTime'])}</div>
        <img
          class="article-image article-image--hero"
          src="{post['heroImage']}"
          alt="{escape(post['heroAlt'])}"
        />
{body_html}
      </article>
    </main>

    <footer>
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="brand">
            <img src="../assets/images/logo-text-new.svg" alt="Bookverse" width="140" height="32" />
          </div>
          <p>Bookverse Series · Triết lý Cuộc sống #1 · Nuôi dưỡng tỉnh thức mỗi ngày.</p>
        </div>
        <div>
          <h4>Serie</h4>
          <p>Giới thiệu</p>
          <p>Podcast Tỉnh thức</p>
          <p>Bản tin email</p>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <p>hello@bookversevn.store</p>
          <p>+84 909 123 456</p>
        </div>
      </div>
      <div class="container" style="margin-top: 24px; color: var(--color-muted); font-size: 0.85rem;">
        &copy; 2024 Bookverse Series. All rights reserved.
      </div>
    </footer>

    <script src="../script.js"></script>
  </body>
</html>
"""


def update_script(posts: list[dict]) -> None:
    script_path = Path("script.js")
    text = script_path.read_text(encoding="utf-8")
    start = text.index("const postsData = ")
    end = text.index("];", start) + 2
    dataset = [
        {
            "title": post["title"],
            "description": post["description"],
            "category": post["category"],
            "author": post["author"],
            "date": post["date"],
            "readingTime": post["readingTime"],
            "image": post["heroImage"],
            "href": f"posts/{post['slug']}.html",
        }
        for post in posts
    ]
    replacement = "const postsData = " + json.dumps(dataset, ensure_ascii=False, indent=2) + ";"
    script_path.write_text(text[:start] + replacement + text[end:], encoding="utf-8")


def main() -> None:
    posts_dir = Path("posts")
    posts_dir.mkdir(exist_ok=True)
    for post in POSTS:
        html_content = build_post_html(post)
        (posts_dir / f"{post['slug']}.html").write_text(html_content, encoding="utf-8")
    update_script(POSTS)


if __name__ == "__main__":
    main()
