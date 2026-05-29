## Mô tả dự án

Dự án là trang portfolio cá nhân được thiết kế với hiệu ứng parallax 2.5D scroll bằng GSAP + threejs deploy lên vercel.
Mong muốn người dùng vào web chỉ cần scroll     lên hoặc xuống các section sẽ thay đổi với hiệu ứng parallax 2.5D 
Có 5 section chính : 
1. Hero section
2. About me section
3. Skills section
4. Projects section
5. Contact section
6. Footer section 

Các yêu cầu kỹ thuật:
- Sử dụng React 19
- Sử dụng GSAP + threejs cho hiệu ứng parallax 2.5D 
- Deploy lên vercel
- Dùng Bun để chạy dự án và tối ưu performance
- Sử dụng Biome để format code và lint

Đọc resume của tôi ở docs/resume.pdf và chuyển sang json để làm dữ liệu hiện thì cho portfolio.


Idea về flow scroll parallax:
-> khi vào web sẽ hiện loading chạy từ o -> 100% để web có thể load được các tài nguyên 3d nặng,
Khi vào thì tôi đang ngồi trước máy tính gõ code với 2 màng hình trước mặt, 1 màng hình chạy code, 1 màng hình hiện tên của tôi và role: vd: Hi! I'm Nguyen Quoc Dai - Software Engineer,
người dùng  scroll thì tôi đứng đậy và quay mặt lại vẫy tay say hi,  và hiện dần các thông tin về PROFESSIONAL SUMMARY, 
scroll tiếp thì sẽ chạy đến kinh nghiệp làm việc của tôi, chạy như timeline cuộc đời qua mỗi cột mốc là 1 công ty tôi từng làm, và mô ta ở đó tôi làm gì? promote như thế nào
scroll tiếp thì đến các skill của tôi. Các skill được chia thành các nhóm như 
    - Languages
    - Frontend
    - Backend
    - AI/LLM
    - AITooling
    - Databases
    - DataViz
    - DevOpsCloud
    - TestingQA
    - Others
    
    Mỗi nhóm sẽ có 1 icon và tên của nhóm, khi hover vào tên nhóm thì sẽ hiện ra các skill của nhóm đó
scroll tiếp thì đến các project của tôi, mỗi project sẽ có 1 thumbnail và tên của project, khi hover vào tên project thì sẽ hiện ra mô tả về project đó và các technologies đã sử dụng. các project được chia thành 2 loại là  
- Full-Stack Engineer
- Team Lead
    
    scroll tiếp thì đến contact của tôi.
    
    scroll tiếp thì sẽ đến footer của tôi.
