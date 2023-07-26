import axios from 'axios';
import cheerio from 'cheerio';
import { CrawlingData } from '../interfaces/crawling';

export const saramin = async (searchword: string) => {
    const res = await axios.get(`https://www.saramin.co.kr/zf_user/search?searchType=search&searchword=${searchword}`);
    const $ = cheerio.load(res.data);
    const content = $('.item_recruit');
    let saraminData: CrawlingData[] = [];

    content.each((i, el) => {
        const companyName = $(el).find('.corp_name a').text().trim();
        const title = $(el).find('.job_tit a span').text().trim();
        const detailOption = {
            area: `${$(el).find('.job_condition span:nth-child(1) a:nth-child(1)').text().trim()} ${$(el).find('.job_condition span:nth-child(1) a:nth-child(2)').text().trim()}`,
            career: $(el).find('span:nth-child(2)').text().trim(),
            academic: $(el).find('span:nth-child(3)').text().trim(),
            typeOfEmployment: $(el).find('span:nth-child(4)').text().trim(),
        };

        const data = {
            companyName: companyName,
            title: title,
            detailOption: detailOption,
        };

        saraminData.push(data);
    });

    return saraminData;
};
