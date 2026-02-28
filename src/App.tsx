import { useState, ChangeEvent } from 'react';
import { User, CreditCard, MapPin, Mail, Link, Copy, Check, ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    email: '',
  });

  const [isCreatingZapSign, setIsCreatingZapSign] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSignatureLink = async () => {
    // Validação de todos os campos obrigatórios
    const requiredFields = Object.values(formData);
    if (requiredFields.some(field => field === '')) {
      alert('Por favor, preencha todos os campos para gerar o link de assinatura.');
      return;
    }

    setIsCreatingZapSign(true);
    setSignatureUrl(null);

    try {
      // Envio dos dados individuais para o servidor
      const response = await axios.post('/api/zapsign/create', {
        name: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        rua: formData.rua,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      });

      if (response.data.sign_url) {
        setSignatureUrl(response.data.sign_url);
      } else {
        throw new Error(response.data.error || 'Erro desconhecido ao criar link');
      }
    } catch (error: any) {
      console.error('Erro ZapSign:', error);
      alert('Erro ao integrar com ZapSign: ' + (error.response?.data?.details?.detail || error.message));
    } finally {
      setIsCreatingZapSign(false);
    }
  };

  const copyToClipboard = () => {
    if (signatureUrl) {
      navigator.clipboard.writeText(signatureUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#4d4d4d] py-6 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://i.postimg.cc/Gt3GpNCS/logo.png" 
            alt="Logo Alonso Advogados" 
            className="mx-auto h-40 w-auto mb-2"
          />
          <p className="text-slate-300 text-sm">Gerador de Procuração (Via ZapSign)</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="space-y-6">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Nome Completo
              </label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none text-white" placeholder="Nome do Outorgante" />
            </div>

            {/* CPF */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> CPF
              </label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none text-white" placeholder="000.000.000-00" />
            </div>

            {/* Endereço Detalhado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Rua/Av</label>
                <input type="text" name="rua" value={formData.rua} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none" placeholder="Logradouro" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none" placeholder="123" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none" placeholder="Centro" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none" placeholder="Cidade" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Estado</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none" placeholder="SP" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email do Outorgante
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none text-white" placeholder="email@cliente.com" />
            </div>

            <div className="pt-6 space-y-3">
              {signatureUrl ? (
                <div className="bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2">
                      <Link className="w-3 h-3" /> Link de Assinatura Gerado
                    </span>
                    <button onClick={() => setSignatureUrl(null)} className="text-[10px] text-white/40 hover:text-white underline">Gerar outro</button>
                  </div>
                  <div className="flex gap-2">
                    <input readOnly value={signatureUrl} className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80" />
                    <button onClick={copyToClipboard} className="p-2 bg-[#c5a059] text-[#4d4d4d] rounded-xl">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <a href={signatureUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 text-white rounded-xl"><ExternalLink className="w-5 h-5" /></a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateSignatureLink}
                  disabled={isCreatingZapSign}
                  className="w-full py-4 bg-[#c5a059] hover:bg-[#b38f4d] disabled:bg-slate-600 text-[#4d4d4d] font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all"
                >
                  {isCreatingZapSign ? (
                    <div className="w-5 h-5 border-2 border-[#4d4d4d]/30 border-t-[#4d4d4d] rounded-full animate-spin" />
                  ) : (
                    <Link className="w-5 h-5" />
                  )}
                  {isCreatingZapSign ? 'Criando Documento...' : 'Gerar Link para Assinatura'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white/30 text-xs uppercase tracking-widest">
          Alonso Advogados &copy; 2026
        </div>
      </div>
    </div>
  );
}