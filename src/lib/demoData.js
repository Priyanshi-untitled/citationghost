export const DEMO_PAPER = { title: 'Attention Is All You Need', authors: 'Vaswani et al., 2017', pages: 15 };

export const DEMO_CLAIMS = [
  {
    id:0, claimType:'factual', pageHint:'introduction', claimStrength:'medium',
    claim: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.",
    citationTitle: "Sequence to Sequence Learning with Neural Networks",
    abstract: "We present a general end-to-end approach to sequence learning using a multilayered LSTM to map input sequences to a fixed-dimensionality vector, then another LSTM to decode.",
    verdict:"SUPPORTED", confidence:0.95, severity:"low", year:2014, citationCount:18420, source:'semantic_scholar',
    explanation:"Sutskever et al. directly describe encoder-decoder LSTM architecture — fully supporting this claim.",
    exactLine:"multilayered Long Short-Term Memory to map the input sequence to a vector of a fixed dimensionality",
    contradiction:null, evidenceStrength:"strong",
    trustMeBro:{ claimStrength:"medium", evidenceStrength:"strong", sampleSize:"large", overclaim:false, overclaimeExplanation:null },
  },
  {
    id:1, claimType:'factual', pageHint:'introduction', claimStrength:'high',
    claim: "Recurrent models preclude parallelization within training examples, which becomes critical at longer sequence lengths.",
    citationTitle: "Long Short-Term Memory",
    abstract: "Learning to store information over extended time intervals by recurrent backpropagation takes a very long time, mostly because of insufficient, decaying error backflow.",
    verdict:"DISTORTED", confidence:0.77, severity:"medium", year:1997, citationCount:70000, source:'semantic_scholar',
    explanation:"LSTM paper discusses vanishing gradients, not parallelization. The parallelization critique is an architectural property, not a finding of this paper.",
    exactLine:"Learning to store information over extended time intervals by recurrent backpropagation takes a very long time",
    contradiction:"LSTM paper addresses gradient flow problems — it never discusses parallelization limitations.",
    evidenceStrength:"moderate",
    trustMeBro:{ claimStrength:"high", evidenceStrength:"moderate", sampleSize:"unclear", overclaim:true, overclaimeExplanation:"Parallelization argument is attributed to this paper but it's the authors' own architectural observation." },
  },
  {
    id:2, claimType:'quantitative', pageHint:'results', claimStrength:'very_high',
    claim: "The Transformer achieves 28.4 BLEU on WMT 2014 English-to-German, improving over existing best results by over 2 BLEU.",
    citationTitle: "Massive Exploration of Neural Machine Translation Architectures",
    abstract: "We present the first large-scale analysis of NMT architecture hyperparameters, achieving 26.2 BLEU on WMT'14 En→De.",
    verdict:"DISTORTED", confidence:0.81, severity:"medium", year:2017, citationCount:2100, source:'semantic_scholar',
    explanation:"Cited paper's best is 26.2 BLEU — it doesn't represent the definitive prior state-of-the-art, making the 'over 2 BLEU improvement' framing misleading.",
    exactLine:"achieving 26.2 BLEU on WMT'14 En→De",
    contradiction:"This paper isn't the established SOTA baseline — using it as the sole comparison overstates improvement.",
    evidenceStrength:"moderate",
    trustMeBro:{ claimStrength:"very_high", evidenceStrength:"moderate", sampleSize:"large", overclaim:true, overclaimeExplanation:"Comparison cherry-picks one baseline that may not represent true state-of-the-art." },
  },
  {
    id:3, claimType:'factual', pageHint:'introduction', claimStrength:'medium',
    claim: "Attention mechanisms allow modeling of dependencies without regard to their distance in the input or output sequences.",
    citationTitle: "Neural Machine Translation by Jointly Learning to Align and Translate",
    abstract: "Each time the model generates a word in translation, it searches for positions in the source sentence where relevant information is concentrated, regardless of distance.",
    verdict:"SUPPORTED", confidence:0.93, severity:"low", year:2014, citationCount:22000, source:'semantic_scholar',
    explanation:"Bahdanau et al. explicitly demonstrate position-independent attention — directly supporting this claim.",
    exactLine:"searches for a set of positions in a source sentence where the most relevant information is concentrated",
    contradiction:null, evidenceStrength:"strong",
    trustMeBro:{ claimStrength:"medium", evidenceStrength:"strong", sampleSize:"large", overclaim:false, overclaimeExplanation:null },
  },
  {
    id:4, claimType:'quantitative', pageHint:'experiments', claimStrength:'high',
    claim: "The authors used byte-pair encoding with a shared vocabulary of exactly 37,000 tokens for English-German translation.",
    citationTitle: "Neural Machine Translation of Rare Words with Subword Units",
    abstract: "We introduce two methods to segment words into subword units using BPE compression algorithm for handling rare and unknown words in NMT.",
    verdict:"HALLUCINATED", confidence:0.88, severity:"high", year:2016, citationCount:8500, source:'semantic_scholar',
    explanation:"Sennrich et al. describe BPE methodology but specify no vocabulary size of 37,000 tokens. This number is an unreferenced implementation choice falsely attributed to this paper.",
    exactLine:"We introduce two methods to segment words into subword units",
    contradiction:"The 37,000 token vocabulary size appears nowhere in this paper — it was the Transformer authors' own choice.",
    evidenceStrength:"none",
    trustMeBro:{ claimStrength:"high", evidenceStrength:"none", sampleSize:"unclear", overclaim:true, overclaimeExplanation:"Specific number attributed to cited paper but doesn't appear in it." },
  },
  {
    id:5, claimType:'methodological', pageHint:'methods', claimStrength:'low',
    claim: "Dropout was applied to the output of each sub-layer and to the sums of the embeddings and positional encodings.",
    citationTitle: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",
    abstract: "We describe dropout, a technique for addressing overfitting by randomly dropping units along with their connections from the neural network during training.",
    verdict:"SUPPORTED", confidence:0.96, severity:"low", year:2014, citationCount:35000, source:'semantic_scholar',
    explanation:"Srivastava et al. fully describe dropout as the overfitting-prevention mechanism used — claim is an accurate application.",
    exactLine:"randomly drop units along with their connections from the neural network during training",
    contradiction:null, evidenceStrength:"strong",
    trustMeBro:{ claimStrength:"low", evidenceStrength:"strong", sampleSize:"large", overclaim:false, overclaimeExplanation:null },
  },
];

export const DEMO_MISSING = [
  { claim:"We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs.", reason:"Dataset size and composition requires citation to the WMT 2014 benchmark paper.", suggestedSearch:"WMT 2014 shared task machine translation dataset", severity:"medium" },
  { claim:"We used the Adam optimizer with β1=0.9, β2=0.98 and ε=10−9.", reason:"Adam optimizer parameters without citation to Kingma & Ba 2014.", suggestedSearch:"Adam optimizer Kingma Ba 2015", severity:"low" },
];

export const DEMO_NETWORK = {
  nodes:[
    {id:"Vaswani",papers:1,role:"self"},{id:"Sutskever",papers:2,role:"cited"},
    {id:"Hochreiter",papers:1,role:"cited"},{id:"Bahdanau",papers:1,role:"cited"},
    {id:"Sennrich",papers:1,role:"cited"},{id:"Srivastava",papers:1,role:"cited"},
    {id:"Luong",papers:1,role:"cited"},
  ],
  edges:[
    {from:"Vaswani",to:"Sutskever",sharedPaper:"Seq2Seq"},{from:"Vaswani",to:"Bahdanau",sharedPaper:"Attention"},
    {from:"Vaswani",to:"Sennrich",sharedPaper:"BPE"},{from:"Bahdanau",to:"Sutskever",sharedPaper:"Encoder-decoder"},
  ],
  clusters:[
    {name:"Sequence Modeling",members:["Sutskever","Hochreiter","Luong"]},
    {name:"Attention",members:["Bahdanau","Vaswani"]},
    {name:"Preprocessing",members:["Sennrich"]},
  ],
};

export const DEMO_QUALITY = { peerReviewed:85, preprint:10, blog:0, lowQualityConf:5, unknown:0, topVenues:["NeurIPS","ICLR","ACL"], concerns:["2 citations from same research group"], overallGrade:"A" };
export const DEMO_DIVERSITY = { diversityScore:72, dominantGroup:null, echoChambered:false, uniqueGroups:6, totalCitations:41, concerns:["Slight over-representation of Google Brain authors"], breakdown:{sameGroup:28,diverse:72} };
