import axios from 'axios';
import cheerio from 'cheerio';
import { CrawlingData } from '../interfaces/crawling';

export const jobkorea = async (keyword: string) => {
    const res = await axios.get(`https://www.jobkorea.co.kr/Search/?stext=${keyword}`);
    const $ = cheerio.load(res.data);
    const content = $('.list-post');
    let jobkoreaData: CrawlingData[] = [];

    for (let i = 0; i < content.length; i++) {
        const el = content[i];
        const companyName = $(el).find('.post-list-corp .name.dev_view').text().trim();
        const title = $(el).find('.post-list-info .title.dev_view').text().trim();
        const href = $(el).find('.post-list-info .title.dev_view').attr('href');
        const day = await getDate(href);

        const detailOption = {
            area: `${$(el).find('.post-list-info .option .loc.long').text().trim()}`,
            career: $(el).find('.post-list-info .option .exp').text().trim(),
            academic: $(el).find('.post-list-info .option .edu').text().trim(),
            typeOfEmployment: $(el).find('.post-list-info .option span:nth-child(3)').text().trim(),
        };

        const sector = $(el).find('.post-list-info .etc').text().trim();

        if (companyName === '' || title === '') {
            continue;
        }

        const data = {
            siteName: '잡코리아 공고',
            companyName: companyName,
            title: title,
            day: day,
            href: 'https://www.jobkorea.co.kr' + href,
            sector: sector
                .split(',')
                .map((item) => item.trim())
                .slice(0, 5),
            detailOption: detailOption,
        };

        jobkoreaData.push(data);
    }

    return jobkoreaData;
};

// 등록일 가져오기
const getDate = async (href: string | undefined): Promise<string> => {
    if (!href) {
        return '';
    }
    const resDate = await axios.get(`https://www.jobkorea.co.kr${href}`);
    const $date = cheerio.load(resDate.data);
    const date = $date('.date dd:nth-child(2) .tahoma').text().trim();
    const formattedDate = date.replace(/\./g, '/');

    if (formattedDate === '') {
        return '상시채용';
    } else {
        return formattedDate;
    }
};
