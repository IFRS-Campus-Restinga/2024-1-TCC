from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from app.models import Tcc, Sessao
from django.http import FileResponse


class UploadDocumentoTCCView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadDocumentoSessaoView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            sessao.documentoTCCSessao = request.FILES['file']
            sessao.save()
            # Update the main document of TCC
            tcc = sessao.tcc
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoTCCView(APIView):
    def delete(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            if tcc.documentoTCC:
                tcc.documentoTCC.delete(save=True)
            tcc.documentoTCC = None
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoSessaoView(APIView):
    def delete(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                sessao.documentoTCCSessao.delete(save=True)
            sessao.documentoTCCSessao = None
            sessao.save()
            return Response(status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


        
class UploadAutorizacaoPublicacaoView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, tccId, *args, **kwargs):
        try:
            tcc = Tcc.objects.get(id=tccId)
            tcc.autorizacaoPublicacao = request.data['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
class DownloadDocumentoTCCView(APIView):
    def get(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            if tcc.documentoTCC:
                response = FileResponse(tcc.documentoTCC, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{tcc.documentoTCC.name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DownloadDocumentoSessaoView(APIView):
    def get(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                response = FileResponse(sessao.documentoTCCSessao, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{sessao.documentoTCCSessao.name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
