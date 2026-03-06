import http from 'http';

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/votes',
    method: 'GET'
};

const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const votes = JSON.parse(data).data;
            if (!votes || votes.length === 0) { console.log('No votes found'); return; }

            const voteId = votes[0].id;
            console.log(`Voting on vote ${voteId}...`);

            const voteOptions = {
                hostname: '127.0.0.1',
                port: 5000,
                path: `/api/votes/${voteId}/vote`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            };

            const voteReq = http.request(voteOptions, voteRes => {
                let voteData = '';
                voteRes.on('data', c => voteData += c);
                voteRes.on('end', () => {
                    console.log(`Vote 1 response: ${voteRes.statusCode} - ${voteData}`);

                    // Vote again (simulate 2nd vote)
                    const voteReq2 = http.request(voteOptions, voteRes2 => {
                        let voteData2 = '';
                        voteRes2.on('data', c => voteData2 += c);
                        voteRes2.on('end', () => {
                            console.log(`Vote 2 response: ${voteRes2.statusCode} - ${voteData2}`);
                        });
                    });
                    voteReq2.write(JSON.stringify({ indices: [0] }));
                    voteReq2.end();
                });
            });
            voteReq.write(JSON.stringify({ indices: [0] }));
            voteReq.end();
        } catch (e) {
            console.error(e);
            console.log("Raw response:", data);
        }
    });
});
req.on('error', console.error);
req.end();
