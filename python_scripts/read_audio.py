import sys
import glob
import numpy as np
from scipy.io import wavfile
import spectrogram as sp
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# read in file names
# change audio_dir to directory where the audio files are
#audio_dir = '/media/sdcard/calls/' #/media/omacaodh/DATA/Data/AIStats_data/calls/'
#audio_files = glob.glob(audio_dir + '*.wav')
#print 'total number of audio files', len(audio_files)

# select a single file
# change the number of the file_id to see different bat calls
#file_id = 0
#file_name = os.path.basename(audio_files[file_id])

#print audio_files[file_id]

# read sys arguments
file_name = sys.argv[1]
#print file_name
print 'filename', file_name

## read audio file
##sample_rate, x = wavfile.read(audio_files[file_id])
sample_rate, x = wavfile.read(file_name)
#sample_rate = 44100
file_length = x.shape[0] / float(sample_rate)
#file_length = 1.0
print 'sampling rate', sample_rate, ', length (secs)', file_length

## create spectrogram
spec = sp.gen_mag_spectrogram_mod(x, sample_rate, 0.001)
print 'number of frequency bins', spec.shape[0]
print 'number of time bins', spec.shape[1]

## plot so we can look at it
plt.figure(1)
plt.imshow(spec)
plt.title("Recording")  #(str(file_id) + ' : ' + file_name)
plt.gca().invert_yaxis()  # flip the frequency axis
plt.xlabel('time (secs)')
plt.ylabel('frequency (kHz)')
#plt.show()

## you can save the spectrogram to as an image
## again we flip it so that the lowest frequencies are at the bottom
plt.imsave(file_name[:-4] + '.png', np.flipud(spec))

## as the calls are too high fequency to hear we slow them down
## by changing the sampling rate (here factor of 10) and save to disk
#op_file_name = file_name[:-4] + '_slow.wav'
#wavfile.write(op_file_name, sample_rate/10.0, x)
#
